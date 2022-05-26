import { performHttpReq, HttpRequestParams } from '~utils/http'
import { formatError } from '~utils/onfidoApi'
import type { StepConfig } from '~types/steps'
import type { documentSelectionType } from '~types/commons'
import type {
  WorkflowResponse,
  OutcomeStepKeys,
  GetWorkflowFunc,
  CompleteWorkflowFunc,
  GetFlowStepFunc,
  WorkflowStepConfig,
} from './utils/WorkflowTypes'

export interface EngineInterface {
  getOutcomeStep(workflow: WorkflowResponse | undefined): OutcomeStepKeys
  getWorkflow: GetWorkflowFunc
  completeWorkflow: CompleteWorkflowFunc
  getWorkFlowStep: GetFlowStepFunc
}

export type EngineProps = {
  token: string
  workflowRunId: string | undefined
  workflowServiceUrl: string
}

export type EngineConfiguration = {
  delay: number
}

export class Engine implements EngineInterface {
  public engineProps: EngineProps

  constructor(engineProps: EngineProps) {
    this.engineProps = engineProps
  }

  getOutcomeStep = (workflow: WorkflowResponse): OutcomeStepKeys => {
    return !workflow.has_remaining_interactive_tasks
      ? 'complete'
      : workflow.outcome
      ? 'pass'
      : 'reject'
  }

  getWorkflow: GetWorkflowFunc = async (): Promise<WorkflowResponse> => {
    const { token, workflowRunId, workflowServiceUrl } = this.engineProps
    if (!token) {
      throw new Error('token not provided')
    }

    return new Promise((resolve, reject) => {
      try {
        const requestParams: HttpRequestParams = {
          method: 'GET',
          contentType: 'application/json',
          endpoint: `${workflowServiceUrl}/workflow_runs/${workflowRunId}`,
          token: `Bearer ${token}`,
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

  completeWorkflow: CompleteWorkflowFunc = async (
    taskId,
    personalData,
    docData
  ): Promise<WorkflowResponse> => {
    const { token, workflowRunId, workflowServiceUrl } = this.engineProps

    if (!token) {
      throw new Error('token not provided')
    }

    return new Promise((resolve, reject) => {
      try {
        const requestParams: HttpRequestParams = {
          method: 'POST',
          contentType: 'application/json',
          payload: JSON.stringify({
            task_id: taskId,
            data: docData.length ? docData : personalData,
          }),
          endpoint: `${workflowServiceUrl}/workflow_runs/${workflowRunId}/complete`,
          token: `Bearer ${token}`,
        }

        performHttpReq(requestParams, resolve, (request) =>
          formatError(request, reject)
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  getCountryFilter = (
    config: Array<documentSelectionType>
  ): Array<documentSelectionType> =>
    config &&
    config.filter((value, index, self) => {
      return (
        self.findIndex((v) => v.issuing_country === value.issuing_country) ===
        index
      )
    })

  getWorkFlowStep = (
    taskId: string | undefined,
    configuration: WorkflowStepConfig
  ): StepConfig | undefined => {
    switch (taskId) {
      case 'upload_document':
      case 'upload_document_photo':
        return {
          type: 'document',
          options: {
            ...configuration,
            countryFilter: this.getCountryFilter(
              configuration.document_selection
            ),
            documentSelection: configuration.document_selection,
          },
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
            dob: '',
            address: {
              country: '',
              line1: '',
              line2: '',
              line3: '',
              town: '',
              state: '',
              postcode: '',
            },
          },
        }
      case 'retry':
        return {
          type: 'retry',
          options: {
            ...configuration,
          },
        }
      default:
        return
    }
  }
}
