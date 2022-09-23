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

  const logInstanceSourceFile = project.getSourceFile(
    fromBasePath('/src/core/Logger/LogInstance.ts')
  )

  const typesSourceFile = project.getSourceFile(
    fromBasePath('/src/core/Logger/types.ts')
  )

  if (!loggerSourceFile || !logInstanceSourceFile || !typesSourceFile) {
    throw new Error("Logger.injection can't find source file(s)")
  }

  const levels = typesSourceFile
    ?.getTypeAlias('LabelKeyType')
    ?.getDescendantsOfKind(SyntaxKind.StringLiteral)
    ?.map((i) => i.getLiteralValue())

  if (!levels?.length) {
    throw new Error("Logger.injection can't find log levels")
  }

  const methodParametersLength = logInstanceSourceFile
    .getClass('LogInstance')
    ?.getProperty('capture')
    ?.getDescendants()
    ?.filter(Node.isArrowFunction)[1]
    ?.getParameters().length

  if (methodParametersLength === 0) {
    throw new Error("Can't find the parameter list of LogInstance.capture")
  }

  loggerSourceFile
    ?.getClass('Logger')
    ?.getMethod('createInstance')
    ?.findReferencesAsNodes()
    ?.forEach((node) => {
      const variableDeclaration = node.getFirstAncestor(
        Node.isVariableDeclaration
      )

      if (!variableDeclaration) {
        return
      }

      variableDeclaration.findReferencesAsNodes().forEach((i) => {
        const callExpression = i.getFirstAncestor(Node.isCallExpression)

        // Exclude import identifiers etc
        if (!callExpression) {
          return
        }

        // Format: Logger.[method]
        const callMethodName = getNthDescendant(
          callExpression,
          Node.isIdentifier,
          2
        ).getText()

        if (levels.indexOf(callMethodName) < 0) {
          return
        }

        const { file, method, line } = abstractOriginInfo(callExpression)
        count++

        appendArgumentsToCallExpression(callExpression, {
          max: methodParametersLength,
          data: [`'${file}'`, `'${method}'`, `'${line}'`],
        })
      })
    })

  console.log(`Extended ${count} Logger.* references with origin info`)
}
