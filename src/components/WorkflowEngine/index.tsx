export * from './engine'
export * from './poller'
import { EngineInterface, EngineProps, Engine } from './engine'

export const workflowEngine = ({
  token,
  workflowRunId,
  workflowServiceUrl,
}: EngineProps): EngineInterface => {
  return new Engine({ token, workflowRunId, workflowServiceUrl })
}
