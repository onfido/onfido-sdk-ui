import { StepConfig, StepTypes } from '~types/steps'
import { useCallback, useState } from 'preact/hooks'

import { formatStep } from '../../index'
import { SdkOptions } from '~types/sdk'
import { UrlsConfig } from '~types/commons'
import { StepsProviderStatus, StepsProvider } from '~types/routers'
import { CancelFunc, poller, PollFunc, Engine } from '../WorkflowEngine'
import type { WorkflowResponse } from '../WorkflowEngine/utils/WorkflowTypes'

type StepsProviderState = {
  status: StepsProviderStatus
  steps: StepConfig[]
  taskId: string | undefined
  error: string | undefined
}

const defaultState: StepsProviderState = {
  status: 'idle',
  taskId: undefined,
  error: undefined,
  steps: [],
}

export const createWorkflowStepsProvider = (
  { token, workflowRunId, ...options }: SdkOptions,
  { onfido_api_url }: UrlsConfig
): StepsProvider => () => {
  const [state, setState] = useState<StepsProviderState>({
    ...defaultState,
    steps: options.steps as StepConfig[],
  })

  const { taskId, status, error, steps } = state
  const workflowServiceUrl = `${onfido_api_url}/v4`

  let workflowEngine = new Engine({ token, workflowRunId, workflowServiceUrl })

  const pollStep = useCallback((cb: () => void) => {
    if (!workflowRunId) return

    poller(async (poll: PollFunc) => {
      if (!workflowRunId) return

      let workflow: WorkflowResponse | undefined

      try {
        workflow = await workflowEngine.getWorkflow()
      } catch {
        setState((state) => ({
          ...state,
          status: 'error',
          error: 'Workflow run ID is not set.',
        }))
      }

      if (!workflow) {
        setState((state) => ({
          ...state,
          status: 'error',
          error: 'Workflow run ID is not set.',
        }))
        return
      }

      console.log('workflow loaded: ', workflow)

      if (workflow.finished || !workflow.has_remaining_interactive_tasks) {
        setState((state) => ({
          ...state,
          status: 'finished',
          taskId: workflow?.task_id,
          // @ts-ignore
          steps: [formatStep(workflowEngine.getOutcomeStep(workflow))],
        }))
        cb()
        return
      }

      // continue polling until interactive task is found
      if (workflow?.task_type !== 'INTERACTIVE') {
        console.log(`Non interactive workflow task, keep polling`)
        poll(1500)
        return
      }

      const step = workflowEngine.getWorkFlowStep(
        workflow.task_def_id,
        workflow.config
      ) as any

      if (!step) {
        setState((state) => ({
          ...state,
          status: 'error',
          error: 'Task is currently not supported.',
        }))
        return
      }

      setState((state) => ({
        ...state,
        status: 'success',
        steps: [formatStep(step)],
        taskId: workflow?.task_id,
      }))
      cb()
    })
  }, [])

  const completeStep = useCallback(
    async (docData: unknown) => {
      if (!workflowRunId || !taskId) {
        return
      }

      setState((state) => ({
        ...state,
        status: 'loading',
      }))

      try {
        await workflowEngine.completeWorkflow(taskId, undefined, [docData])
        setState((state) => ({
          ...state,
          taskId: undefined,
          status: 'complete',
          docData: [],
          personalData: {},
        }))
      } catch {
        setState((state) => ({
          ...state,
          status: 'error',
          error: 'Could not complete workflow task.',
        }))
      }
    },
    [taskId]
  )

  const loadNextStep = useCallback(
    (cb: () => void) => {
      if (!workflowRunId) {
        setState((state) => ({
          ...state,
          status: 'error',
          error: 'Workflow run ID is not set.',
        }))
        return
      }

      setState((state) => ({
        ...state,
        status: 'loading',
      }))

      pollStep(cb)
    },
    [pollStep]
  )

  return {
    completeStep,
    loadNextStep,
    status,
    steps,
    error,
  }
}
