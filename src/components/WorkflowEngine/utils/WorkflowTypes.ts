export type GetWorkflowFunc = () => Promise<WorkflowResponse>
export type CompleteWorkflowFunc = (
  taskId: string,
  personalData?: unknown,
  docData?: unknown[]
) => Promise<WorkflowResponse>

export type GetFlowStepFunc = (
  taskId: string | undefined,
  configuration: WorkflowStepConfig
) => unknown

export type WorklowTaskStepKeys = string
export type OutcomeStepKeys = 'pass' | 'reject' | 'complete'
export type StepKeys = 'loading' | WorklowTaskStepKeys | OutcomeStepKeys

export type WorkflowResponse = {
  id: string
  applicant_id: string
  task_type?: 'START' | 'INTERACTIVE' | 'SYNC' | 'ASYNC' | 'FINAL' | 'CUSTOM'
  task_id?: string
  task_def_id?: string | undefined
  config: WorkflowStepConfig
  finished: boolean
  outcome: boolean | undefined
  error: string | undefined
  has_remaining_interactive_tasks: boolean
}

export type WorkflowStepConfig =
  | {
      [name: string]: unknown
    }
  | undefined
