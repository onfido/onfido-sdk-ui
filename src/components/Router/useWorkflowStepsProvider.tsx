import { WorkflowResponse } from '~types/api'
import { StepConfig, StepTypes } from '~types/steps'
import { useCallback, useState } from 'preact/hooks'
import { completeWorkflow, getWorkflow } from '~utils/onfidoApi'
import { poller, PollFunc } from '~utils/poller'
import { formatStep } from '../../index'
import { SdkOptions } from '~types/sdk'
import { UrlsConfig } from '~types/commons'
import { StepsProviderStatus, StepsProvider } from '~types/routers'

const getOutcomeStep = (workflow: WorkflowResponse): StepTypes => {
  return !workflow.has_remaining_interactive_tasks
    ? 'complete'
    : workflow.outcome
    ? 'pass'
    : 'reject'
}

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

  const pollStep = useCallback((cb: () => void) => {
    if (!workflowRunId) return

    poller(async (poll: PollFunc) => {
      if (!workflowRunId) return

      let workflow: WorkflowResponse | undefined

      try {
        workflow = await getWorkflow(
          token,
          `${onfido_api_url}/v4`,
          workflowRunId
        )
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
          steps: [formatStep(getOutcomeStep(workflow))],
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

      const step = getWorkFlowStep(workflow.task_def_id, workflow.config) as any

      if (!step) {
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
        await completeWorkflow(
          token,
          `${onfido_api_url}/v4`,
          workflowRunId,
          taskId,
          undefined,
          docData
        )
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

  const getWorkFlowStep = (
    taskId: string | undefined,
    configuration: {
      [name: string]: unknown
    } | null
  ) => {
    console.log(`requested step for task ${taskId}`)

    switch (taskId) {
      case 'upload_document':
      case 'upload_document_photo':
        return {
          type: 'document',
          options: configuration,
        }
      case 'upload_face_photo':
        return {
          type: 'face',
          options: {
            ...configuration,
            requestedVariant: 'standard',
            uploadFallback: false,
          },
        }
      case 'upload_face_video':
        return {
          type: 'face',
          options: {
            ...configuration,
            requestedVariant: 'video',
            uploadFallback: false,
            photoCaptureFallback: false,
          },
        }
      case 'profile_data':
        return {
          type: 'data',
          options: {
            ...configuration,
            first_name: '',
            last_name: '',
            // email: '',
            dob: '',
            address: {
              // flat_number: '',
              // building_number: '',
              // building_name: '',
              // street: '',
              // sub_street: '',
              // town: '',
              postcode: '',
              country: '',
              state: '',
              // state: '',
              // line1: '',
              // line2: '',
              // line3: '',
            },
          },
        }
      default:
        setState((state) => ({
          ...state,
          error: 'Task is currently not supported.',
        }))
        return
    }
  }

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
