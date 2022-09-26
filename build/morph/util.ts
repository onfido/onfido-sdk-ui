import { CallExpression, Node } from 'ts-morph'
import { fromBasePath } from './project'

// node: CallExpression
export const abstractOriginInfo = (callExpression: CallExpression) => {
  const filePath = callExpression
    .getSourceFile()
    .getFilePath()
    .replace(fromBasePath(), '')
  const lineNumber = callExpression.getStartLineNumber()

  const anc = callExpression.getAncestors()
  const trace: string[] = []
  anc.forEach((x) => {
    if (
      Node.isMethodDeclaration(x) ||
      Node.isFunctionDeclaration(x) ||
      Node.isClassDeclaration(x) ||
      Node.isVariableDeclaration(x) ||
      Node.isFunctionExpression(x) ||
      Node.isPropertyDeclaration(x)
    ) {
      trace.push(x.getName() || '')
    }
  })
  const methodName = trace.reverse().join('.')

  return {
    filePath,
    methodName,
    lineNumber,
  }
}

export const appendArgumentsToCallExpression = (
  callExpression: CallExpression,
  { max, data }: { max: number; data: string[] }
) => {
  const originArguments = callExpression.getArguments()
  const originArgumentsLength = originArguments.length
  const expectedArgumentLength = max - data.length

  if (originArgumentsLength < expectedArgumentLength) {
    // Too few arguments, add a couple
    callExpression.addArguments(
      new Array(expectedArgumentLength - originArgumentsLength).fill('null')
    )
  } else if (originArgumentsLength > expectedArgumentLength) {
    // Too many arguments, remove a couple
    originArguments
      .slice(-(originArgumentsLength - expectedArgumentLength))
      .forEach((i) => callExpression.removeArgument(i))
  }

  callExpression.addArguments(data)
}

// @ts-ignore
export const getNthDescendant = (node, condition, nth) => {
  let count = 0
  for (const descendant of node._getDescendantsIterator()) {
    if (condition == null || condition(descendant)) {
      count++
    }
    if (count === nth) {
      return descendant
    }
  }
  return undefined
}
