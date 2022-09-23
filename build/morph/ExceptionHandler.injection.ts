/*
  Inject origin location data into Logger methods at build time
    - file: string
    - method: string
    - line: string
*/
import { Node, Project } from 'ts-morph'
import { fromBasePath } from './project'
import { abstractOriginInfo, appendArgumentsToCallExpression } from './util'

export default (project: Project) => {
  let count = 0

  const sourceFile = project.getSourceFile(
    fromBasePath('/src/core/ExceptionHandler/index.ts')
  )

  if (!sourceFile) {
    throw new Error('Can not find the source file for ExceptionHandler')
  }

  const trackException = sourceFile.getVariableDeclaration('captureException')
  const trackExceptionParameters = trackException
    ?.getFirstDescendant(Node.isArrowFunction)
    ?.getParameters()

  if (!trackExceptionParameters) {
    throw new Error("Can't find parameters for captureException")
  }

  trackException?.findReferencesAsNodes().forEach((node) => {
    const callExpression = node.getFirstAncestor(Node.isCallExpression)
    if (!callExpression) {
      return
    }

    const { file, method, line } = abstractOriginInfo(callExpression)
    count++

    appendArgumentsToCallExpression(callExpression, {
      max: trackExceptionParameters.length,
      data: [`'${file}'`, `'${method}'`, `'${line}'`],
    })
  })

  console.log(
    `Extended ${count} ExceptionHandler.captureException references with origin info`
  )
}
