package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.Optional;

public class DocumentVideoCapture extends BasePage {

    public static final By CAPTURE_BTN = ByUtil.onfidoQa("doc-video-capture-btn");
    public static final By SUCCESS_TICK = By.cssSelector(".onfido-sdk-ui-DocumentVideo-reusables-success");
    public static final By ERROR_TITLE = By.cssSelector(".onfido-sdk-ui-Error-title-text");

    public DocumentVideoCapture(Driver driver) {
        super(driver);
    }

    public boolean isPassportOverlayDisplayed() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-Overlay-passport")).isDisplayed();
    }

    public DocumentVideoCapture clickRecordButton() {
        click(ByUtil.onfidoQa("doc-video-capture-btn"));
        return this;
    }

    public String videoTitle() {
        return text(By.cssSelector(".onfido-sdk-ui-DocumentVideo-reusables-title"));
    }

    public boolean isOverlayPlaceholderDisplayed() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-Overlay-placeholder")).isDisplayed();
    }


    public DocumentVideoCapture waitForCaptureButton() {
        driver.waitFor.visibility(CAPTURE_BTN);
        return this;
    }

    public String buttonText() {
        return text(CAPTURE_BTN);
    }

    public WebElement successTick() {
        return driver.findElement(SUCCESS_TICK);
    }

    public DocumentVideoCapture waitForUploadToComplete() {

        sleep(1000);
        driver.waitFor.invisible(By.cssSelector(".onfido-sdk-ui-DocumentVideo-reusables-active"));

        return this;
    }

    public WebElement paperOrPlasticCard() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-paperIdFlowSelector"));
    }

    public WebElement plasticCardButton() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-cardId"));
    }

    public WebElement paperDocumentButton() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-DocumentVideo-PaperIdFlowSelector-paperId"));
    }

    public WebElement cardOverlay() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-Overlay-card"));
    }

    public WebElement steps() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-DocumentVideo-CaptureControls-progress"));
    }

    public DocumentVideoCapture waitForTickToDisappear() {

        driver.waitFor.invisible(SUCCESS_TICK);

        return this;
    }

    public WebElement frenchDriverLicenseOverlay() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-Overlay-frPaperDl"));
    }

    public Optional<WebElement> getCameraHint() {
        return driver.findElementIfAvailable(By.cssSelector(".onfido-sdk-ui-Error-container"));
    }

    public DocumentVideoCapture waitForCameraHint(int timeout) {
        driver.waitFor(timeout).visibility(ERROR_TITLE);
        return this;
    }

    public String getErrorTitleText() {
        return text(ERROR_TITLE);
    }

    public DocumentVideoCapture dismissError() {
        click(By.cssSelector(".onfido-sdk-ui-Error-dismiss"));
        return this;
    }

    public DocumentVideoCapture clickStartAgain() {
        click(By.cssSelector(".onfido-sdk-ui-Button-fallbackButton"));
        return this;
    }

    @Override
    protected By pageId() {
        return pageIdSelector("DocumentVideoCapture");
    }
}
