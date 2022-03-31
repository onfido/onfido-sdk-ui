import { EngineInterface, EngineProps } from '../engine'
import type {
  WorkflowResponse,
  OutcomeStepKeys,
  GetWorkflowFunc,
} from '../utils/WorkflowTypes'

export class MockEngine implements EngineInterface {
  private engineProps: EngineProps

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
    return {
      id: 'ec9013ea',
      applicant_id: 'd8034341-5ca2-4f90-a1c6-ae92c9519a21',
      config: { name: 'timeout', value: 1209600 },
      //created_at:"2022-03-16T12:08:53.158824",
      finished: false,
      // state:"in_progress",
      task_def_id: 'upload_document_photo',
      task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      task_type: 'INTERACTIVE',
      // updated_at:"2022-03-16T12:09:11.972281",
      // version_id:5,
      // workflow_id:"5600f9cc-ea4d-4d29-9d23-355005dc7946"
      outcome: null,
      error: null,
      has_remaining_interactive_tasks: true,
    }
  }

  completeWorkflow = async (
    taskId: string,
    personalData?: any,
    docData?: any
  ): Promise<WorkflowResponse> => {
    return {
      id: 'Xec9013ea',
      applicant_id: 'd8034341-5ca2-4f90-a1c6-ae92c9519a21',
      config: { name: 'timeout', value: 1209600 },
      //created_at:"2022-03-16T12:08:53.158824",
      finished: false,
      // state:"in_progress",
      task_def_id: 'upload_document_photo',
      task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      task_type: 'INTERACTIVE',
      // updated_at:"2022-03-16T12:09:11.972281",
      // version_id:5,
      // workflow_id:"5600f9cc-ea4d-4d29-9d23-355005dc7946"
      outcome: null,
      error: null,
      has_remaining_interactive_tasks: true,
    }
  }

  getWorkFlowStep = (
    taskId: string | undefined,
    configuration: {
      [name: string]: unknown
    } | null
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
    }
  }
}
