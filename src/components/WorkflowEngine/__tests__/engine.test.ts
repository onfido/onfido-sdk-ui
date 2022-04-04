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

  describe('with Workflow Outcome', () => {
    it('should return outcome step: "complete"', async () => {
      const workflow = {
        id: 'Xec9013ea',
        applicant_id: 'd8034341-5ca2-4f90-a1c6-ae92c9519a21',
        config: { name: 'timeout', value: 1209600 },
        finished: true,
        task_def_id: 'upload_document_photo',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
        outcome: undefined,
        error: undefined,
        has_remaining_interactive_tasks: false,
      }
      const outcomeStep = workflowEngine1.getOutcomeStep(workflow)
      expect(outcomeStep).toEqual('complete')
    })

    it('should return outcome step as: "Pass"', async () => {
      const workflow1 = {
        id: 'Xec9013ea',
        applicant_id: 'd8034341-5ca2-4f90-a1c6-ae92c9519a21',
        config: { name: 'timeout', value: 1209600 },
        finished: true,
        task_def_id: 'upload_document_photo',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
        outcome: true,
        error: undefined,
        has_remaining_interactive_tasks: true,
      }
      const outcomeStep = workflowEngine1.getOutcomeStep(workflow1)
      expect(outcomeStep).toEqual('pass')
    })

    it('should return outcome step as: "Reject"', async () => {
      const workflow2 = {
        id: 'Xec9013ea',
        applicant_id: 'd8034341-5ca2-4f90-a1c6-ae92c9519a21',
        config: { name: 'timeout', value: 1209600 },
        finished: true,
        task_def_id: 'upload_document_photo',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
        outcome: undefined,
        error: undefined,
        has_remaining_interactive_tasks: true,
      }
      const outcomeStep = workflowEngine1.getOutcomeStep(workflow2)
      expect(outcomeStep).toEqual('reject')
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
        config: { name: 'timeout', value: 1209600 },
        task_type: 'INTERACTIVE',
        task_def_id: 'upload_document_photo',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowDocumentStep.task_def_id,
        workflowDocumentStep.config
      )
      expect(workflowStep?.type).toEqual('document')
    })

    it('should return face capture photo Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600 },
        task_type: 'INTERACTIVE',
        task_def_id: 'upload_face_photo',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config
      ) as StepConfigFace

      expect(workflowStep.type).toEqual('face')
      expect(workflowStep.options?.requestedVariant).toEqual('standard')
    })

    it('should return face capture video Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600 },
        task_type: 'INTERACTIVE',
        task_def_id: 'upload_face_video',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config
      ) as StepConfigFace

      expect(workflowStep?.type).toEqual('face')
      expect(workflowStep?.options?.requestedVariant).toEqual('video')
    })

    it('should return proof of address Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600 },
        task_type: 'INTERACTIVE',
        task_def_id: 'proof_of_address_capture',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config
      )
      expect(workflowStep?.type).toEqual('poa')
    })

    it('should return Profile data capture Step', async () => {
      const workflowFacCaptureStep = {
        config: { name: 'timeout', value: 1209600 },
        task_type: 'INTERACTIVE',
        task_def_id: 'profile_data',
        task_id: '2a11059f-b2dd-4374-9e72-58bb2cb410b8',
      }
      const workflowStep = workflowEngine1.getWorkFlowStep(
        workflowFacCaptureStep.task_def_id,
        workflowFacCaptureStep.config
      )
      expect(workflowStep?.type).toEqual('data')
    })
  })
})
