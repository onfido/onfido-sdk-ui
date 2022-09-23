// @ts-nocheck
import { CallExpression, Node } from 'ts-morph'
import { fromBasePath } from './project'

// node: CallExpression
export const abstractOriginInfo = (callExpression: CallExpression) => {
  const file = callExpression
    .getSourceFile()
    .getFilePath()
    .replace(fromBasePath(), '')
  const line = callExpression.getStartLineNumber()

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
  const method = trace.reverse().join('.')

  return {
    file,
    method,
    line,
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
      new Array(expectedArgumentLength - originArgumentsLength).fill(
        'undefined'
      )
    )
  } else if (originArgumentsLength > expectedArgumentLength) {
    // Too many arguments, remove a couple
    originArguments
      .slice(-(originArgumentsLength - expectedArgumentLength))
      .forEach((i) => callExpression.removeArgument(i))
  }

  callExpression.addArguments(data)
}

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
