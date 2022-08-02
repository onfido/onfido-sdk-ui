import type { documentSelectionType } from '~types/commons'
import type {
  StepConfig,
  GetDocDataFunc,
  GetPersonalDataFunc,
} from '~types/steps'

export type GetWorkflowFunc = () => Promise<WorkflowResponse>
export type CompleteWorkflowFunc = (
  taskId: string,
  personalData: Record<string, unknown>,
  docData: Array<{ id: string }>
) => Promise<WorkflowResponse>

export type GetFlowStepFunc = (
  taskId: string | undefined,
  configuration: WorkflowStepConfig,
  {
    getDocData,
    getPersonalData,
  }: {
    getDocData: GetDocDataFunc
    getPersonalData: GetPersonalDataFunc
  }
) => StepConfig | undefined

export type documentSelectionConfigType = {
  document_selection: Array<documentSelectionType>
}

export type WorklowTaskStepKeys = string
export type StepKeys = 'loading' | WorklowTaskStepKeys | 'complete'
export type WorkflowTaskTypes =
  | 'START'
  | 'INTERACTIVE'
  | 'SYNC'
  | 'ASYNC'
  | 'FINAL'
  | 'CUSTOM'

export type WorkflowResponse = {
  id: string
  applicant_id: string
  task_type?: WorkflowTaskTypes
  task_id?: string
  task_def_id?: string | undefined
  config: WorkflowStepConfig
  finished: boolean
  error: string | undefined
  has_remaining_interactive_tasks: boolean
}

export type WorkflowStepConfig = documentSelectionConfigType & {
  [name: string]: unknown
}
