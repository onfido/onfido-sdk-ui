import { performHttpRequest, HttpRequestParams } from '~core/Network'
import { formatError } from '~utils/onfidoApi'
import type { documentSelectionType } from '~types/commons'
import type {
  WorkflowResponse,
  GetWorkflowFunc,
  CompleteWorkflowFunc,
  GetFlowStepFunc,
} from './utils/WorkflowTypes'

export interface EngineInterface {
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

        performHttpRequest(requestParams, resolve, (request) =>
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

        performHttpRequest(requestParams, resolve, (request) =>
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

  getWorkFlowStep: GetFlowStepFunc = (
    taskId,
    configuration,
    { getDocData, getPersonalData }
  ) => {
    const options = {
      ...configuration,
      getDocData,
      getPersonalData,
    }

    switch (taskId) {
      case 'upload_document':
      case 'upload_document_photo':
        return {
          type: 'document',
          options: {
            ...options,
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
            ...options,
            requestedVariant: 'standard',
            uploadFallback: false,
          },
        }
      case 'upload_face_video':
        return {
          type: 'face',
          options: {
            ...options,
            requestedVariant: 'video',
            uploadFallback: false,
            photoCaptureFallback: false,
          },
        }
      case 'proof_of_address_capture':
        return {
          type: 'poa',
          options: { ...options },
        }
      case 'profile_data':
        return {
          type: 'data',
          options: {
            ...options,
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
            getPersonalData,
          },
        }
      case 'retry':
        return {
          type: 'retry',
          options: { ...options },
        }
      default:
        return
    }
  }
}
