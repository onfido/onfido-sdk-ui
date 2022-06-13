import { TranslateCallback } from '~types/locales'

export const WorkflowRunError = {
  task_not_supported: 'workflow_erros.task_not_supported',
  task_not_completed: 'workflow_erros.task_not_completed',
  task_not_retrieved: 'workflow_erros.task_not_retrieved',
  no_workflow_run_id: 'workflow_erros.no_workflow_run_id',
  title: 'workflow_erros.generic_title',
  reload_app: 'workflow_erros.reload_app',
}

export const WorkflowRunStrings = (
  translate: TranslateCallback
): Record<string, string> => ({
  FaceTec_accessibility_cancel_button: translate(
    'auth_accessibility.back_button'
  ),
  WorkflowRun_error_task_not_supported: translate(
    WorkflowRunError['task_not_supported']
  ),
  WorkflowRun_error_task_not_completed: translate(
    WorkflowRunError['task_not_completed']
  ),
  WorkflowRun_error_task_not_retrieved: translate(
    WorkflowRunError['task_not_retrieved']
  ),
  WorkflowRun_error_no_workflow_run_id: translate(
    WorkflowRunError['no_workflow_run_id']
  ),
  WorkflowRun_error_title: translate(WorkflowRunError['title']),
  WorkflowRun_error_reload_app: translate(WorkflowRunError['reload_app']),
})
