import { StepConfig } from '~types/steps'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import { formatStep } from '../../index'
import { FlowVariants, NarrowSdkOptions, UrlsConfig } from '~types/commons'
import { StepsHook, CompleteStepValue } from '~types/routers'
import { poller, PollFunc, Engine } from '~workflow-engine'
import type { WorkflowResponse } from '~workflow-engine/utils/WorkflowTypes'
import useUserConsent from '~contexts/useUserConsent'
import { noop } from '~utils/func'
import useActiveVideo from '~contexts/useActiveVideo'

type WorkflowStepsState = {
  loading: boolean
  steps: StepConfig[] | undefined
  hasNextStep: boolean
  hasPreviousStep: boolean
  taskId: string | undefined
  error: string | undefined
}

const defaultState: WorkflowStepsState = {
  loading: false,
  taskId: undefined,
  error: undefined,
  steps: undefined,
  hasNextStep: true,
  hasPreviousStep: false,
}

const captureStepTypes = new Set(['document', 'poa', 'face'])

export const createWorkflowStepsHook = (
  { token, workflowRunId, ...options }: NarrowSdkOptions,
  { onfido_api_url }: UrlsConfig
): StepsHook => () => {
  const { addUserConsentStep } = useUserConsent()
  const { replaceFaceWithActiveVideoStep } = useActiveVideo()

  const [state, setState] = useState<WorkflowStepsState>({
    ...defaultState,
  })

  useEffect(() => {
    if (options.mobileFlow) {
      loadNextStep(noop)
      return
    }

    // We only inject this step in the first workflow task
    if (options.steps.every(({ type }) => type !== 'welcome')) {
      return
    }

    setState((state) => ({
      ...state,
      steps: addUserConsentStep(replaceFaceWithActiveVideoStep(options.steps)),
    }))
  }, [addUserConsentStep, replaceFaceWithActiveVideoStep])

  const { taskId, loading, error, steps, hasNextStep, hasPreviousStep } = state

  const docData = useRef<Array<{ id: string }>>([])
  const getDocData = useCallback(() => {
    return docData.current
  }, [docData])
  const personalData = useRef<Record<string, unknown>>({})
  const getPersonalData = useCallback(() => {
    return personalData.current
  }, [personalData])

  const pollStep = useCallback((cb: () => void) => {
    if (!token) {
      throw new Error('No token provided')
    }

    if (!workflowRunId) {
      throw new Error('No workflowRunId provided')
    }

    const workflowEngine = new Engine({
      token,
      workflowRunId,
      workflowServiceUrl: `${onfido_api_url}/v4`,
    })

    poller(async (poll: PollFunc) => {
      let workflow: WorkflowResponse | undefined

      try {
        workflow = await workflowEngine.getWorkflow()
      } catch {
        setState((state) => ({
          ...state,
          loading: false,
          error: 'Workflow run ID is not set.',
        }))
        return
      }

      console.log('workflow loaded: ', workflow)

      if (workflow.finished || !workflow.has_remaining_interactive_tasks) {
        setState((state) => ({
          ...state,
          loading: false,
          hasNextStep: false,
          taskId: workflow?.task_id,
          steps: [formatStep('complete')],
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
        workflow.config,
        { getDocData, getPersonalData }
      )

      if (!step) {
        setState((state) => ({
          ...state,
          loading: false,
          error: 'Task is currently not supported.',
        }))
        return
      }

      // If the step is not displayable on mobile we display the complete step
      const formattedStep = formatStep(step)
      const steps =
        options.mobileFlow && !captureStepTypes.has(formattedStep.type)
          ? [formatStep('complete')]
          : [formattedStep]

      setState((state) => ({
        ...state,
        loading: false,
        steps,
        taskId: workflow?.task_id,
      }))
      cb()
    })
  }, [])

  const completeStep = useCallback((data: CompleteStepValue) => {
    if (Array.isArray(data)) {
      docData.current = [...docData.current, ...data]
    } else {
      personalData.current = { ...personalData.current, ...data }
    }
  }, [])

  const loadNextStep = useCallback(
    (cb: () => void, flow?: FlowVariants) => {
      if (!workflowRunId) {
        throw new Error('No token provided')
      }

      if (!token) {
        throw new Error('No token provided')
      }

      setState((state) => ({
        ...state,
        loading: true,
      }))

      // When the browser is in `crossDeviceSteps` it doesn't have to complete the step
      if (!taskId || flow === 'crossDeviceSteps') {
        pollStep(cb)
        return
      }

      const workflowEngine = new Engine({
        token,
        workflowRunId,
        workflowServiceUrl: `${onfido_api_url}/v4`,
      })

      workflowEngine
        .completeWorkflow(taskId, personalData.current, docData.current)
        .then(() => {
          setState((state) => ({
            ...state,
            loading: true,
            taskId: undefined,
            steps: undefined,
            hasPreviousStep: true,
          }))
          docData.current = []
          personalData.current = {}
        })
        .catch(() =>
          setState((state) => ({
            ...state,
            loading: false,
            error: 'Could not complete workflow task.',
          }))
        )
        .finally(() => pollStep(cb))
    },
    [pollStep, docData, personalData, taskId]
  )

  return {
    completeStep,
    loadNextStep,
    hasPreviousStep,
    hasNextStep,
    loading,
    steps,
    error,
  }
}
