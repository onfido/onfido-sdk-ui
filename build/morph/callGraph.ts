// @ts-nocheck
// const { VariableDeclaration } = require('abstract-syntax-tree')
const { Project, ScriptTarget, Node, PropertyAssignment } = require('ts-morph')
const { SyntaxKind } = require('typescript')
import { getProject, fromBasePath } from "./project"

// const project = new Project({
//   tsConfigFilePath: '../tsconfig.json'
// })

const project = getProject()

const sourceFile = project.getSourceFile(
  fromBasePath('/src/Tracker/onfidoTracker.tsx')
)

// const sourceFile = project.getSourceFile('./source/onfidoTracker.tsx')
const origin = sourceFile.getVariableDeclaration('sendAnalyticsEvent')

const trees = []

const reverseUp = (originNode, tree = []) => {
  if(!originNode.findReferencesAsNodes){
    console.log(originNode.getKindName(), originNode?.getStartLineNumber(), originNode?.getSourceFile().getFilePath())
    return
  }

  originNode.findReferencesAsNodes().forEach(node => {
    const parent = node.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration)
    
    let parent2 = node.getFirstAncestorByKind(SyntaxKind.ArrowFunction)
    if(parent2){
      parent2 = parent2.getFirstAncestorByKind(SyntaxKind.Variabl)
    }

    const funcNode = parent || parent2
    console.log('funcNode', !!funcNode)
    if(funcNode){
      reverseUp(funcNode, [...tree, funcNode])
    } 
    // else {
    // //   trees.push([...tree, node])
    // // }
  })
}

reverseUp(origin, [origin])

const logTrees = (trees) => {
  trees.forEach((tree, index) => {
    console.group(index)

    tree.forEach(node => {
      console.log(
        node.getSymbol().getName(), 
        `${node.getSourceFile().getFilePath()}:${node.getStartLineNumber()}`, 
        node.getStartLinePos())
    })

    console.groupEnd()
  })
}


// logTrees(trees)