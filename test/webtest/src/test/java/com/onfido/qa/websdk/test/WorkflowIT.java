package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.mock.Consent;
import com.onfido.qa.websdk.mock.SdkConfiguration;
import com.onfido.qa.websdk.mock.TaskDefinition;
import com.onfido.qa.websdk.mock.WorkflowRun;
import com.onfido.qa.websdk.mock.config.UploadDocumentConfig;
import com.onfido.qa.websdk.mock.config.UploadDocumentConfig.DocumentSelection;
import com.onfido.qa.websdk.page.BasePage;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.page.DocumentUpload;
import com.onfido.qa.websdk.page.Error;
import com.onfido.qa.websdk.page.FaceVideoIntro;
import com.onfido.qa.websdk.page.ImageQualityGuide;
import com.onfido.qa.websdk.page.PoAIntro;
import com.onfido.qa.websdk.page.ProfileData;
import com.onfido.qa.websdk.page.RestrictedDocumentSelection;
import com.onfido.qa.websdk.page.Retry;
import com.onfido.qa.websdk.page.SelfieIntro;
import com.onfido.qa.websdk.page.SpinnerPage;
import com.onfido.qa.websdk.page.UserConsent;
import com.onfido.qa.websdk.page.Welcome;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.Locale;
import java.util.UUID;

import static com.onfido.qa.websdk.DocumentType.DRIVING_LICENCE;
import static com.onfido.qa.websdk.DocumentType.PASSPORT;
import static com.onfido.qa.websdk.mock.Code.CONSENTS;
import static com.onfido.qa.websdk.mock.Code.SDK_CONFIGURATION;
import static com.onfido.qa.websdk.mock.Code.WORKFLOW_RUN;
import static com.onfido.qa.websdk.mock.Code.WORKFLOW_RUN_COMPLETE;

import static org.assertj.core.api.Assertions.assertThat;

@SuppressWarnings("BooleanParameter")
public class WorkflowIT extends WebSdkIT {

    public static final int SERVICE_UNAVAILABLE = 503;
    public static final int NOT_FOUND = 404;
    public static final int UNAUTHORIZED = 401;

    static UUID workflowRunId = UUID.randomUUID();

    @DataProvider
    public static Object[][] taskDefinitions() {

        return new Object[][]{
                {TaskDefinition.UPLOAD_DOCUMENT, RestrictedDocumentSelection.class},
                {TaskDefinition.UPLOAD_DOCUMENT_PHOTO, RestrictedDocumentSelection.class},
                {TaskDefinition.UPLOAD_FACE_PHOTO, SelfieIntro.class},
                {TaskDefinition.UPLOAD_FACE_VIDEO, FaceVideoIntro.class},
                {TaskDefinition.PROOF_OF_ADDRESS_CAPTURE, PoAIntro.class},
                {TaskDefinition.PROFILE_DATA, ProfileData.class},
                {TaskDefinition.RETRY, Retry.class}
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

        verifyPage(RestrictedDocumentSelection.class);

    }

    @Test(description = "return of an interactive task, shows the related steps", dataProvider = "taskDefinitions")
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

    @Test(description = "test if complete returns with a status not equal to 200 an error is shown")
    public void testTestIfCompleteReturnsWithAStatusNotEqualTo200AnErrorIsShown() {
        var confirmUpload
                = onfido()
                .withWorkflowRunId(workflowRunId)
                .withMock(mock -> {
                    mock.set(WORKFLOW_RUN, new WorkflowRun(workflowRunId, TaskDefinition.UPLOAD_DOCUMENT));
                    mock.response(WORKFLOW_RUN_COMPLETE, SERVICE_UNAVAILABLE);
                })
                .init(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class)
                .selectCountry("France")
                .selectDocument(PASSPORT, DocumentUpload.class)
                .clickUploadButton(ImageQualityGuide.class)
                .upload(UploadDocument.PASSPORT_JPG);


        mock().response(WORKFLOW_RUN, SERVICE_UNAVAILABLE);
        confirmUpload.clickConfirmButton(null);

        verifyPage(Error.class);

    }

    @Test(description = "show complete screen when the complete post has no remaining tasks or the workflow is finished", dataProvider = "booleans")
    public void testShowCompleteScreenWhenTheCompletePostHasNoRemainingTasksOrTheWorkflowIsFinished(boolean useRemaining) {

        var workflowRun = new WorkflowRun(workflowRunId, TaskDefinition.UPLOAD_DOCUMENT);

        if (useRemaining) {
            workflowRun.hasRemainingInteractiveTasks = false;
        } else {
            workflowRun.finished = true;
        }

        onfido()
                .withWorkflowRunId(workflowRunId)
                .withMock(mock -> {
                    mock.set(WORKFLOW_RUN, workflowRun);
                })
                .init(Welcome.class)
                .continueToNextStep(Complete.class);

    }

    @Test(description = "workflow run is not available")
    public void testWorkflowRunIsNotAvailable() {
        // should display something with workflow run is missing
        var error = onfido()
                .withWorkflowRunId(workflowRunId)
                .withMock(mock -> {
                    mock.response(WORKFLOW_RUN, NOT_FOUND);
                })
                .init(Welcome.class)
                .continueToNextStep(Error.class);

        assertThat(error.errorMessage()).isEqualTo("Workflow run ID is not set.");
    }


    @Test(description = "workflow run with cross device")
    public void testWorkflowRunWithCrossDevice() {
        // TODO: implement testWorkflowRunWithCrossDevice
    }

    @Test(description = "restrictedDocumentSelectionIsOnlyShowingSupportingCountries")
    public void testRestrictedDocumentSelectionIsOnlyShowingSupportingCountries() {

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
        var documentSelections = Arrays.asList(
                new DocumentSelection(PASSPORT, "FRA"),
                new DocumentSelection(DRIVING_LICENCE, "FRA"),
                new DocumentSelection(PASSPORT, "DEU")
        );

        var selection = onfido()
                .withWorkflowRunId(workflowRunId)
                .withMock(mock -> {
                    mock.set(WORKFLOW_RUN, new WorkflowRun(workflowRunId, TaskDefinition.UPLOAD_DOCUMENT, new UploadDocumentConfig(documentSelections)));
                })
                .init(Welcome.class)
                .continueToNextStep(RestrictedDocumentSelection.class);


        var countries = selection.getCountries();

        assertThat(countries.stream().filter(x -> x.toLowerCase(Locale.ROOT).contains("germany")).count()).withFailMessage("Germany not present").isEqualTo(1);
        assertThat(countries.stream().filter(x -> x.toLowerCase(Locale.ROOT).contains("france")).count()).withFailMessage("France not present").isEqualTo(1);

        selection.selectCountry("germany");

        assertThat(selection.getOptions()).containsExactlyInAnyOrderElementsOf(Arrays.asList(PASSPORT));

        selection.selectCountry("france");
        assertThat(selection.getOptions()).containsExactlyInAnyOrderElementsOf(Arrays.asList(PASSPORT, DRIVING_LICENCE));
    }
}
