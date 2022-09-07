// @ts-nocheck
/*
  Inject origin location data into Logger methods at build time
    - filePath: string
    - method: string
    - lineNumber: string
*/
import { Node, Project } from 'ts-morph'
import {
  abstractOriginInfo,
  getNthDescendant,
  appendArgumentsToCallExpression,
} from './util'
import { fromBasePath } from './project'
import { SyntaxKind } from 'typescript'

export default (project: Project) => {
  let count = 0

  const loggerSourceFile = project.getSourceFile(
    fromBasePath('/src/core/Logger/Logger.ts')
  )

  const typesSourceFile = project.getSourceFile(
    fromBasePath('/src/core/Logger/types.ts')
  )

  if (!loggerSourceFile || !typesSourceFile) {
    throw new Error("Logger.injection can't find source file(s)")
  }

  const levels = typesSourceFile
    ?.getTypeAlias('LogLevels')
    ?.getDescendantsOfKind(SyntaxKind.StringLiteral)
    ?.map((i) => i.getLiteralValue())

  if (!levels?.length) {
    throw new Error("Logger.injection can't find log levels")
  }

  const methodParametersLength = loggerSourceFile
    .getTypeAlias('logMethodProps')
    .getDescendants()
    .filter(Node.isNamedTupleMember).length

  if (methodParametersLength === 0) {
    throw new Error("Can't find the parameter list of LogInstance.capture")
  }

  // Find all references for each "level" method
  const refs = []
  levels.forEach((level) => {
    loggerSourceFile
      ?.getClass('Logger')
      ?.getMethod(level)
      ?.findReferencesAsNodes()
      ?.forEach((node) => {
        if (node) {
          refs.push(node)
        }
      })
  })

  refs.forEach((node) => {
    const callExpression = node.getFirstAncestor(Node.isCallExpression)

    if (!callExpression) {
      return
    }

    const { file, method, line } = abstractOriginInfo(callExpression)
    console.log({ file, method, line })
    count++

    appendArgumentsToCallExpression(callExpression, {
      max: methodParametersLength,
      data: [`'${file}'`, `'${method}'`, `'${line}'`],
    })
  })

  console.log(`Extended ${count} Logger.* references with origin info`)
}
