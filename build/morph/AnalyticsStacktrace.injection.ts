// @ts-nocheck
/*
  Inject origin location data into Logger methods at build time
    - filePath: string
    - method: string
    - lineNumber: string
*/
import { Node, Project, SyntaxKind } from 'ts-morph'
import { fromBasePath } from './project'
import { abstractOriginInfo, appendArgumentsToCallExpression } from './util'

export default (project: Project) => {
  let count = 0

  const sourceFile = project.getSourceFile(
    fromBasePath('/src/Tracker/index.tsx')
  )

  if (!sourceFile) {
    throw new Error('Can not find the source file for ExceptionHandler')
  }

  const sendEvent = sourceFile.getVariableDeclaration('sendEvent')
  const sendScreen = sourceFile.getVariableDeclaration('sendScreen')
  const appendToTracking = sourceFile.getVariableDeclaration('appendToTracking')
  const trackComponent = sourceFile.getVariableDeclaration('trackComponent')

  const stepsRouterSourceFile = project.getSourceFile(
    fromBasePath('/src/components/Router/StepsRouter.tsx')
  )
  
  const StepsRouter = stepsRouterSourceFile.getClass('StepsRouter')

  const trackScreenMethod = StepsRouter?.getProperties().find(
    (i) => i.getName() === 'trackScreen'
  )
  const trackScreenParams = trackScreenMethod
    ?.getFirstDescendant(Node.isArrowFunction)
    ?.getParameters()

    console.log('trackScreenParams', trackScreenParams?.length)

  const render = StepsRouter?.getProperty('render')

  const l = render?.getDescendantsOfKind(SyntaxKind.PropertyAssignment)
  const trackScreen = l.find((i) => i.getName() === 'trackScreen')



  const addOriginInfo = (node) => {
    if(!node){ return }

    const { filePath, methodName, lineNumber } = abstractOriginInfo(
      node
    )

    if (
      filePath === '/src/Tracker/index.tsx' ||
      filePath === 'src/components/Router/StepsRouter.tsx'
    ) {
      return false
    }

    console.log('filePath', node.getText())

    // count++
    appendArgumentsToCallExpression(node, {
      max: 3, //trackScreenParams.length,
      data: [
        `{ filePath: '${filePath}', methodName: '${methodName}', lineNumber: '${lineNumber}', analyticsMethod: 'trackScreen'}`,
      ],
    })
  }

  trackScreen?.findReferencesAsNodes().forEach((node) => {
    const callExpression = node.getFirstAncestor(Node.isCallExpression)

    if (!callExpression) {
      node.findReferencesAsNodes().forEach(n => {
        const s = n.getFirstAncestor(Node.isCallExpression)

        if(s){
          // console.log('name', s.getKindName())
          addOriginInfo(s)
        }
      })
      return
    }
    addOriginInfo(callExpression)
  })


  // console.log(trackScreen.findReferencesAsNodes().length)

  /*

  TODO:
    - add ancestorScreenNameHierarchy to see the contruct of the legacy name
*/

  // console.log(sendEvent?.findReferencesAsNodes().length)
  ;[
    { name: 'sendEvent', method: sendEvent },
    { name: 'sendScreen', method: sendScreen },
    { name: 'appendToTracking', method: appendToTracking },
    { name: 'trackComponent', method: trackComponent },
  ].forEach(({ method, name }) => {
    let count = 0
    const params = method
      ?.getFirstDescendant(Node.isArrowFunction)
      ?.getParameters()

    const references = method?.findReferencesAsNodes()

    references.forEach((node) => {
      const callExpression = node.getFirstAncestor(Node.isCallExpression)

      if (!callExpression?.getText().match(new RegExp(`^${name}.*`))) {
        return
      }

      const { filePath, methodName, lineNumber } = abstractOriginInfo(
        callExpression
      )

      if (
        filePath === '/src/Tracker/index.tsx' ||
        filePath === 'src/components/Router/StepsRouter.tsx'
      ) {
        return false
      }

      console.log('filePath', callExpression.getText())

      count++
      appendArgumentsToCallExpression(callExpression, {
        max: params.length,
        data: [
          `{ filePath: '${filePath}', methodName: '${methodName}', lineNumber: '${lineNumber}', analyticsMethod: '${name}'}`,
        ],
      })
    })

    console.log(`Added to ${count} references`)
  })

  project.save()
  // trackException?.findReferencesAsNodes().forEach((node) => {
  //   const callExpression = node.getFirstAncestor(Node.isCallExpression)
  //   if (!callExpression) {
  //     return
  //   }

  //   const { filePath, methodName, lineNumber } = abstractOriginInfo(
  //     callExpression
  //   )

  //   count++

  //   appendArgumentsToCallExpression(callExpression, {
  //     max: trackExceptionParameters.length,
  //     data: [`'${filePath}'`, `'${methodName}'`, `'${lineNumber}'`],
  //   })
  // })

  // console.log(
  //   `Extended ${count} ExceptionHandler.captureException references with origin info`
  // )
}
