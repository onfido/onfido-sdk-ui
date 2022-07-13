import { Project } from 'ts-morph'
import { join } from 'path'

export const fromBasePath = (path?: string) => join(process.cwd(), path || '')

let projectCache: Project
export const getProject = () => {
  projectCache = new Project({
    tsConfigFilePath: fromBasePath('/tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  })

  projectCache.addSourceFilesAtPaths([
    '!src/**/{__integrations__,__mocks__,__tests__}/**/*{.d.ts,.ts,.tsx,.js,.jsx}',
    'src/**/*{.d.ts,.ts,.tsx,.js,.jsx}',
  ])

  return projectCache
}

export const getSourceFileAsString = (path: string) => {
  const sourceFile = projectCache.getSourceFile(path)

  if (!sourceFile) {
    throw new Error(`Could not find source file ${path}`)
  }

  return sourceFile.getText()
}
