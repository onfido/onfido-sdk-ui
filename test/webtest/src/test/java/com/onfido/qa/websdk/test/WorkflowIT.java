package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.mock.TaskDefinition;
import com.onfido.qa.websdk.mock.WorkflowRun;
import com.onfido.qa.websdk.page.BasePage;
import com.onfido.qa.websdk.page.CountrySelector;
import com.onfido.qa.websdk.page.FaceVideoIntro;
import com.onfido.qa.websdk.page.PoAIntro;
import com.onfido.qa.websdk.page.ProfileData;
import com.onfido.qa.websdk.page.RestrictedDocumentSelection;
import com.onfido.qa.websdk.page.SelfieIntro;
import com.onfido.qa.websdk.page.SpinnerPage;
import com.onfido.qa.websdk.page.Welcome;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.UUID;

import static com.onfido.qa.websdk.mock.Code.WORKFLOW_RUN;
import static org.assertj.core.api.Assertions.assertThat;

public class WorkflowIT extends WebSdkIT {

    static UUID workflowRunId = UUID.randomUUID();

    @DataProvider
    public static Object[][] foo() {

        return new Object[][]{
                {TaskDefinition.UPLOAD_DOCUMENT, RestrictedDocumentSelection.class},
                {TaskDefinition.UPLOAD_DOCUMENT_PHOTO, RestrictedDocumentSelection.class},
                {TaskDefinition.UPLOAD_FACE_PHOTO, SelfieIntro.class},
                {TaskDefinition.UPLOAD_FACE_VIDEO, FaceVideoIntro.class},
                {TaskDefinition.PROOF_OF_ADDRESS_CAPTURE, PoAIntro.class},
                {TaskDefinition.PROFILE_DATA, ProfileData.class}
        };
    }

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
    @Test(description = "return of an interactive task, shows the related steps", dataProvider = "foo")
    public void testReturnOfAnInteractiveTaskShowsTheRelatedSteps(TaskDefinition taskDefinition, Class<BasePage> expectedPage) {

        var page = onfido()
                .withWorkflowRunId(workflowRunId)
                .withMock(mock -> {
                    mock.set(WORKFLOW_RUN, new WorkflowRun(workflowRunId, taskDefinition));
                })
                .init(Welcome.class)
                .continueToNextStep(expectedPage);

        assertThat(page.backArrow().isDisplayed()).isFalse();


    }
}
