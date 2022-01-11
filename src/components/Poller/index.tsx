/** Workflow Stepper begin 
const poller = (fn: any) => {
    let isCancelled = false
    let timer: any = null
  
    const cancel = () => {
      if (!isCancelled) {
        clearTimeout(timer)
        timer = null
        isCancelled = true
      }
    }
  
    const pollDelayed = (delayMillis: number) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (isCancelled) return
  
        fn(pollDelayed)
      }, delayMillis)
    }
  
    fn(pollDelayed)
  
    return cancel
  }
  
  const getWorkflow = (
    isMfe: boolean,
    token: string | undefined,
    url: string | undefined,
    workflowRunId: string,
    applicantId: string
  ): Promise<WorkflowResponse> => {
    console.log('get workflow call to API')
  
    return new Promise((resolve, reject) => {
      try {
        const requestParams: HttpRequestParams = {
          method: 'GET',
          contentType: 'application/json',
          endpoint: `${url}/workflow_runs/${workflowRunId}`,
        }
  
        if (!isMfe) {
          requestParams.headers = { 'x-onfido-applicant-id': applicantId }
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
  
  
  
  const completeWorkflow = (
    isMfe: boolean,
    token: string | undefined,
    url: string | undefined,
    workflowRunId: string,
    taskId: string,
    applicantId: string,
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
          endpoint: `${url}/workflow_runs/${workflowRunId}/complete`,
        }
  
        if (!isMfe) {
          requestParams.headers = { 'x-onfido-applicant-id': applicantId }
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
   Workflow Stepper end */
