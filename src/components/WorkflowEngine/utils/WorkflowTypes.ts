import type { StepConfig } from '~types/steps'
export type GetWorkflowFunc = () => Promise<WorkflowResponse>
export type CompleteWorkflowFunc = (
  taskId: string,
  personalData?: any,
  docData?: any
) => Promise<WorkflowResponse>

export type GetFlowStepFunc = (
  taskId: string | undefined,
  configuration: {
    [name: string]: unknown
  } | null
) => unknown

export type WorklowTaskStepKeys = string
export type OutcomeStepKeys = 'pass' | 'reject' | 'complete'
export type StepKeys = 'loading' | WorklowTaskStepKeys | OutcomeStepKeys

export type WorkflowResponse = {
  id: string
  applicant_id: string
  task_type?: 'START' | 'INTERACTIVE' | 'SYNC' | 'ASYNC' | 'FINAL' | 'CUSTOM'
  task_id?: string | undefined
  task_def_id?: string | undefined
  config: {
    [name: string]: unknown
  } | null
  finished: boolean
  outcome: boolean | null
  error: string | null
  has_remaining_interactive_tasks: boolean
}
