import { StepConfig } from '~types/steps'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'

import { formatStep } from '../../index'
import { NarrowSdkOptions, UrlsConfig } from '~types/commons'
import { StepsHook, CompleteStepValue } from '~types/routers'
import { poller, PollFunc, Engine } from '../WorkflowEngine'
import type { WorkflowResponse } from '../WorkflowEngine/utils/WorkflowTypes'
import useUserConsent from '~contexts/useUserConsent'
import useActiveVideo from '~contexts/useActiveVideo'

type WorkflowStepsState = {
  loading: boolean
  steps: StepConfig[] | undefined
  hasNextStep: boolean
  taskId: string | undefined
  error: string | undefined
}

const defaultState: WorkflowStepsState = {
  loading: false,
  taskId: undefined,
  error: undefined,
  steps: undefined,
  hasNextStep: true,
}

export const createWorkflowStepsHook = (
  { token, workflowRunId, ...options }: NarrowSdkOptions,
  { onfido_api_url }: UrlsConfig
): StepsHook => () => {
  const { addUserConsentStep } = useUserConsent()
  const { addActiveVideoStep } = useActiveVideo()

  const [state, setState] = useState<WorkflowStepsState>({
    ...defaultState,
  })

  useEffect(() => {
    // We only inject this step in the first workflow task
    if (options.steps.every(({ type }) => type !== 'welcome')) {
      return
    }

    setState((state) => ({
      ...state,
      steps: addUserConsentStep(addActiveVideoStep(options.steps)),
    }))
  }, [addUserConsentStep, addActiveVideoStep])

  const { taskId, loading, error, steps, hasNextStep } = state

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

      setState((state) => ({
        ...state,
        loading: false,
        steps: [formatStep(step)],
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
    (cb: () => void) => {
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

      if (!taskId) {
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
    hasNextStep,
    loading,
    steps,
    error,
  }
}
