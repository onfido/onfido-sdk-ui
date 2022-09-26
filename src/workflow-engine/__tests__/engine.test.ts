import { jwtToken } from '~jest/responses'
import { Engine } from '../engine'
import { workflowEngine } from '../'
import { StepConfigFace } from '~types/steps'

const fakeUrl = 'https://fake-api.onfido.com'

describe('Workflow Engine', () => {
  it('should return proper engine for the workflow engine', () => {
    expect(
      workflowEngine({
        token: jwtToken,
        workflowRunId: `xxxxx`,
        workflowServiceUrl: `${fakeUrl}/v4`,
      })
    ).toBeInstanceOf(Engine)
  })

  let workflowEngine1: Engine

  beforeEach(() => {
    workflowEngine1 = new Engine({
      token: jwtToken,
      workflowRunId: `xxxxx`,
      workflowServiceUrl: `${fakeUrl}/v4`,
    })
  })

  describe('WorkflowStep task', () => {
    beforeEach(() => {
      workflowEngine1 = new Engine({
        token: jwtToken,
        workflowRunId: `xxxxx`,
        workflowServiceUrl: `${fakeUrl}/v4`,
      })
    })

    it('should return document capture Step', async () => {
      const workflowDocumentStep = {
        config: { name: 'timeout', value: 1209600, document_selection: [] },
        task_type: 'INTERACTIVE',
        task_def_id: 'upload_document_photo',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowDocumentStep.task_def_id,
        workflowDocumentStep.config,
        { getDocData: jest.fn(), getPersonalData: jest.fn() }
      )
      expect(workflowStep?.type).toEqual('document')
    })

    it('should return face capture photo Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600, document_selection: [] },
        task_type: 'INTERACTIVE',
        task_def_id: 'upload_face_photo',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config,
        { getDocData: jest.fn(), getPersonalData: jest.fn() }
      ) as StepConfigFace

      expect(workflowStep.type).toEqual('face')
      expect(workflowStep.options?.requestedVariant).toEqual('standard')
    })

    it('should return face capture video Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600, document_selection: [] },
        task_type: 'INTERACTIVE',
        task_def_id: 'upload_face_video',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config,
        { getDocData: jest.fn(), getPersonalData: jest.fn() }
      ) as StepConfigFace

      expect(workflowStep?.type).toEqual('face')
      expect(workflowStep?.options?.requestedVariant).toEqual('video')
    })

    it('should return proof of address Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600, document_selection: [] },
        task_type: 'INTERACTIVE',
        task_def_id: 'proof_of_address_capture',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config,
        { getDocData: jest.fn(), getPersonalData: jest.fn() }
      )
      expect(workflowStep?.type).toEqual('poa')
    })

    it('should return Profile data capture Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600, document_selection: [] },
        task_type: 'INTERACTIVE',
        task_def_id: 'profile_data',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config,
        { getDocData: jest.fn(), getPersonalData: jest.fn() }
      )
      expect(workflowStep?.type).toEqual('data')
    })

    it('should return Retry Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600, document_selection: [] },
        task_type: 'INTERACTIVE',
        task_def_id: 'retry',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config,
        { getDocData: jest.fn(), getPersonalData: jest.fn() }
      )
      expect(workflowStep?.type).toEqual('retry')
    })
  })
})
