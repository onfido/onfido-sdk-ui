import React, { useCallback, useEffect, useState } from 'react'
import { CancelFunc, poller, PollFunc } from './utils'
import { performHttpReq, HttpRequestParams } from '~utils/http'
import { formatError } from '~utils/onfidoApi'

export type EngineProps = {
  token: string
  applicantId: string
  workflowRunId: string
  steps: EngineSteps
  configuration: EngineConfiguration
  onTaskLoadError: () => JSX.Element
  onTaskExecuteError: () => JSX.Element
}

export type EngineSteps = {
  loading: Step
  passed?: Step
  rejected?: Step
} & {
  [key in WorklowTaskStepKeys]: Step
}

export type EngineConfiguration = {
  delay: number
}

type WorklowTaskStepKeys = string;
type OutcomeStepKeys = 'passed' | 'rejected';
type StepKeys = 'loading' | WorklowTaskStepKeys | OutcomeStepKeys;
type Step = () => JSX.Element;
/**
export const Engine = ({
  workflowRunId,
  token,
  steps,
  configuration,
  onTaskLoadError,
  onTaskExecuteError,
}: EngineProps) => {
  const [element, setElement] = useState<JSX.Element | null>(null);
  const [, setCancel] = useState<CancelFunc | null>(null);

  const makeElement = useCallback(
    (name: StepKeys, props = {}): JSX.Element | null => {
      const Element = steps[name];

      if (Element) return <Element {...props} />;

      return null;
    },
    [steps]
  );

  const poll = useCallback(
    async (poll: PollFunc) => {
      setElement(makeElement('loading'));

      let workflow;

      try {
        workflow = await getWorkflow({workflowRunId, token, url });
      } catch {
        setElement(onTaskLoadError());
        return;
      }

      if (workflow.finished) {
        setElement(makeElement(workflow.outcome ? 'passed' : 'rejected'));
        return;
      }

      if (workflow.task_type !== 'INTERACTIVE') {
        poll(configuration.delay);
        return;
      }

      try {
        setElement(makeElement(workflow.task_def_id));
      } catch {
        setElement(onTaskExecuteError());
      }
    },
    [
      workflowRunId,
      configuration,
      makeElement,
      onTaskLoadError,
      onTaskExecuteError,
    ]
  );

  const start = useCallback(() => {
    setCancel(poller(poll));
  }, [setCancel, poll]);

  useEffect(() => {
    start();
  }, [start]);

  return element;
};


const getWorkflow: GetWorkflowFunc = async ({ workflowRunId }) => {
  const response = await fetch(
    `${process.env.WORKFLOW_SERVICE_URL}/workflow_runs/${workflowRunId}/`,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.json();
};*/

type GetWorkflowFunc = (params: {
  workflowRunId: EngineProps['workflowRunId']
  token: string | undefined
  workflowServiceUrl: string
}) => Promise<WorkflowResponse>

export const getWorkflow: GetWorkflowFunc = async ({
  workflowRunId,
  token,
  workflowServiceUrl,
}): Promise<WorkflowResponse> => {
  return new Promise((resolve, reject) => {
    try {
      const requestParams: HttpRequestParams = {
        method: 'GET',
        contentType: 'application/json',
        endpoint: `${workflowServiceUrl}/workflow_runs/${workflowRunId}`,
      }

      if (token) {
        requestParams.token = `Bearer ${token}`
      }

      performHttpReq(requestParams, resolve, (request) =>
        formatError(request, reject)
      )
    } catch (error) {
      console.log('API error: ', error)
      reject(error)
    }
  })
}

export const completeWorkflow = (
  token: string | undefined,
  workflowServiceUrl: string,
  workflowRunId: string,
  taskId: string,
  personalData?: any,
  docData?: any
): Promise<WorkflowResponse> => {
  console.log('complete workflow call to API')

  return new Promise((resolve, reject) => {
    try {
      const requestParams: HttpRequestParams = {
        method: 'POST',
        contentType: 'application/json',
        payload: JSON.stringify({
          task_id: taskId,
          data: docData.length ? docData : personalData || {},
        }),
        endpoint: `${workflowServiceUrl}/workflow_runs/${workflowRunId}/complete`,
      }

      if (token) {
        requestParams.token = `Bearer ${token}`
      }

      performHttpReq(requestParams, resolve, (request) =>
        formatError(request, reject)
      )
    } catch (error) {
      reject(error)
    }
  })
}

export const getWorkFlowStep = (
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
    case 'proof_of_address_capture':
      return {
        type: 'poa',
        options: {
          ...configuration,
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
      return
  }
}

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
