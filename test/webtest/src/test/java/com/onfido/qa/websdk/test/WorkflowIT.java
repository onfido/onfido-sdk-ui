package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.mock.Consent;
import com.onfido.qa.websdk.mock.SdkConfiguration;
import com.onfido.qa.websdk.mock.TaskDefinition;
import com.onfido.qa.websdk.mock.WorkflowRun;
import com.onfido.qa.websdk.page.*;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.UUID;

import static com.onfido.qa.websdk.mock.Code.*;
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

    @Test(description = "show consent screen, if consent is not already given")
    public void testConsentScreenShownWhenConsentNotAlreadyGiven() {
        var userConsent = onfido()
                .withWorkflowRunId(workflowRunId)
                .withMock(mock -> {
                    mock.set(WORKFLOW_RUN, new WorkflowRun(workflowRunId, TaskDefinition.UPLOAD_DOCUMENT));
                    mock.extend(SDK_CONFIGURATION, new SdkConfiguration().withEnableRequireApplicantConsents(true));
                })
                .init(Welcome.class)
                .continueToNextStep(UserConsent.class)
                .acceptUserConsent(RestrictedDocumentSelection.class);


        verifyCopy(userConsent.title(), "doc_select.title");
    }

    @Test(description = "do not show consent screen, if consent is already given")
    public void testConsentScreenNotShownWhenConsentAlreadyGiven() {
        var document = onfido()
                .withWorkflowRunId(workflowRunId)
                .withMock(mock -> {
                    mock.set(WORKFLOW_RUN, new WorkflowRun(workflowRunId, TaskDefinition.UPLOAD_DOCUMENT));
                    mock.extend(SDK_CONFIGURATION, new SdkConfiguration().withEnableRequireApplicantConsents(true));
                    mock.set(CONSENTS, Arrays.asList(new Consent("privacy_notices_read_consent_given").withGranted(true)));
                })
                .init(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class);

        verifyCopy(document.title(), "doc_select.title");
    }
}
