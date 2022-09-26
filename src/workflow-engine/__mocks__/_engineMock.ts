import { EngineInterface, EngineProps } from '../engine'
import type {
  WorkflowResponse,
  GetWorkflowFunc,
  WorkflowStepConfig,
} from '../utils/WorkflowTypes'

export class MockEngine implements EngineInterface {
  public engineProps: EngineProps

  constructor(engineProps: EngineProps) {
    this.engineProps = engineProps
  }

  getWorkflow: GetWorkflowFunc = async (): Promise<WorkflowResponse> => {
    return {
      id: 'ec9013ea',
      applicant_id: 'd8034341-5ca2-4f90-a1c6-ae92c9519a21',
      config: { name: 'timeout', value: 1209600, document_selection: [] },
      finished: false,
      task_def_id: 'upload_document_photo',
      task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      task_type: 'INTERACTIVE',
      error: 'error',
      has_remaining_interactive_tasks: true,
    }
  }

  completeWorkflow = async (
    taskId: string,
    personalData?: unknown,
    docData?: unknown[]
  ): Promise<WorkflowResponse> => {
    return {
      id: 'Xec9013ea',
      applicant_id: 'd8034341-5ca2-4f90-a1c6-ae92c9519a21',
      config: { name: 'timeout', value: 1209600, document_selection: [] },
      finished: false,
      task_def_id: 'upload_document_photo',
      task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      task_type: 'INTERACTIVE',
      error: undefined,
      has_remaining_interactive_tasks: true,
    }
  }

  // @ts-ignore
  getWorkFlowStep = (
    taskId: string | undefined,
    configuration: WorkflowStepConfig
  ) => {
    switch (taskId) {
      case 'upload_document':
      case 'upload_document_photo':
        return {
          type: 'document',
          options: { ...configuration },
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
              postcode: '',
              country: '',
              state: '',
            },
          },
        }
    }
  }
}
