package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.page.Modal;
import com.onfido.qa.websdk.page.Welcome;
import org.openqa.selenium.Keys;
import org.testng.annotations.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class ModalIT extends WebSdkIT {

    public static final int HALF_A_SECOND = 500;

    @Test(description = "should be able to close modal with ESC button")
    public void testCloseModalWithEsc() throws InterruptedException {
        testCloseModal(() -> driver().actions().sendKeys(Keys.ESCAPE).perform());
    }

    @Test(description = "should be able to open, close and re-open a modal view")
    public void testCloseWithButton() throws InterruptedException {
        testCloseModal(() -> {
            new Welcome(driver()).clickCloseModal();
        });

    }

    @Test(description = "should close modal on background click", dataProvider = "booleans")
    public void testCloseOnBackgroundClick(boolean shouldCloseOnOverlayClick) throws InterruptedException {
        testCloseModal(() -> {
            new Modal(driver()).clickOnOverlay();
        }, shouldCloseOnOverlayClick, !shouldCloseOnOverlayClick);
    }

    private void testCloseModal(Runnable closeModal) throws InterruptedException {
        testCloseModal(closeModal, true, false);
    }

    private void testCloseModal(Runnable closeModal, boolean shouldCloseOnOverlayClick, boolean expectedCloseState) throws InterruptedException {
        var onfido = onfido()
                .withUseModal()
                .withSteps("welcome")
                .withShouldCloseOnOverlayClick(shouldCloseOnOverlayClick)
                .init();
        var modal = new Modal(driver());

        assertThat(modal.isShown()).isFalse();

        onfido.setOption("isModalOpen", true);

        assertThat(modal.isShown()).isTrue();
        var welcome = new Welcome(driver());

        assertThat(welcome.hasCloseModalButton()).isTrue();

        closeModal.run();

        Thread.sleep(HALF_A_SECOND);

        assertThat(modal.isShown()).isEqualTo(expectedCloseState);

    }
}
