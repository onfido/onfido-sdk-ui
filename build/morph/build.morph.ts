// @ts-nocheck
/*
  Mofidy source files by using AST (Abtract Syntax Tree) modifications

  Note:
  - Run only at build time. Once project is loaded, the files won't get updated with new changes for hot reload.
*/
import { getProject } from './project'
export { getSourceFileAsString } from './project'

import exceptionHandlerInjection from './ExceptionHandler.injection'
import loggerInjection from './Logger.injection'

export default () => {
  const project = getProject()

  exceptionHandlerInjection(project)
  loggerInjection(project)
}
