package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

import java.util.Arrays;

import static com.onfido.qa.websdk.page.ConfirmUpload.HALF_A_SECOND;

public class FaceVideo extends Camera {

    public ConfirmUpload record() {

        sleep(ONE_SECOND);

        click(By.cssSelector(".onfido-sdk-ui-FaceVideo-btn"));

        sleep(HALF_A_SECOND);

        click(ByUtil.onfidoQa("liveness-next-challenge-btn"));

        sleep(HALF_A_SECOND);

        click(ByUtil.onfidoQa("liveness-stop-recording-btn"));

        return new ConfirmUpload(driver);
    }

    public FaceVideo(Driver driver) {
        super(driver);
    }

    public FaceVideo waitForWarningMessage(int seconds) {
        driver.waitFor(seconds).visibility(By.cssSelector(".onfido-sdk-ui-Error-container-warning"));
        return this;
    }

    public boolean isOverlayPresent() {
        var element = driver.findElement(ByUtil.onfidoQa("faceOverlay"));
        return Arrays.asList(element.getAttribute("class").split(" ")).contains("onfido-sdk-ui-Overlay-isWithoutHole");
    }

    @Override
    protected By pageId() {
        return pageIdSelector("FaceVideo");
    }
}
