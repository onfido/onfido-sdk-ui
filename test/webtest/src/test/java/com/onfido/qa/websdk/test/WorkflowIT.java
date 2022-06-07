package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.mock.TaskDefinition;
import com.onfido.qa.websdk.mock.WorkflowRun;
import com.onfido.qa.websdk.page.CountrySelector;
import com.onfido.qa.websdk.page.SpinnerPage;
import com.onfido.qa.websdk.page.Welcome;
import org.testng.annotations.Test;

import java.util.UUID;

import static com.onfido.qa.websdk.mock.Code.WORKFLOW_RUN;

public class WorkflowIT extends WebSdkIT {

    static UUID workflowRunId = UUID.randomUUID();

    @Test(description = "Polling only stops, when an interactive task is found")
    public void testPollingOnlyStopsWhenAnInteractiveTaskIsFound() {

        onfido()
                .withWorkflowRunId(workflowRunId)
                .withMock(mock -> {
                    mock.set(WORKFLOW_RUN, new WorkflowRun(workflowRunId, null));
                })
                .init(Welcome.class)
                .continueToNextStep(SpinnerPage.class);

        mock().set(WORKFLOW_RUN, new WorkflowRun(workflowRunId, TaskDefinition.UPLOAD_DOCUMENT));

        verifyPage(CountrySelector.class);

    }


    /***
     * @see engine.ts getWorkFlowStep
     */
    @Test(description = "return of an interactive task, shows the related steps")
    public void testReturnOfAnInteractiveTaskShowsTheRelatedSteps() {

    }
}
