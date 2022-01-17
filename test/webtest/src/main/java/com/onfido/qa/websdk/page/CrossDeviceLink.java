package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.model.CrossDeviceLinkMethod;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

import java.util.Arrays;

public class CrossDeviceLink extends BasePage {

    public static final By PHONE_NUMBER = By.cssSelector(".onfido-sdk-ui-PhoneNumberInput-phoneNumberContainer #phoneNumberInput");

    public CrossDeviceLink(Driver driver) {
        super(driver);
    }

    public String copyLink() {

        clickLinkOption();

        return getLink();

    }

    public String getLink() {
        return text(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText"));
    }

    public CrossDeviceLink clickQrCodeHelp() {
        click(By.cssSelector(".onfido-sdk-ui-QRCode-qrCodeHelpButton"));
        return this;
    }

    public boolean isQrHelpListDisplayed() {
        return isDisplayed(By.cssSelector(".onfido-sdk-ui-QRCode-qrCodeHelpList"));
    }

    public boolean isQrCodeIsDisplayed() {
        return isDisplayed(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-qrCodeContainer svg"));
    }

    public String copyLinkText() {
        return text(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-copyToClipboard"));
    }

    public boolean isOptionAvailable(CrossDeviceLinkMethod method) {
        return driver.isInDom(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-" + method.className));
    }

    public boolean alternativeMethodOptionsSectionIsDisplayed() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-viewOptionsGroup")).isDisplayed();
    }

    public boolean isPhoneNumberErrorShown() {
        return driver.findElement(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-numberError")).isDisplayed();
    }

    private boolean isDisplayed(By by) {
        return driver.findElement(by).isDisplayed();
    }

    public CrossDeviceLink sendSms(String phoneNumber) {
        clickSmsOption();
        typeSmsNumber(phoneNumber);
        clickSendSms();

        return this;
    }

    public CrossDeviceLink clickSendSms() {
        click(ByUtil.onfidoQa("cross-device-send-link-btn"));
        return this;
    }

    public CrossDeviceLink typeSmsNumber(String phoneNumber) {
        input(PHONE_NUMBER, phoneNumber);
        return this;
    }

    public CrossDeviceLink clickSmsOption() {
        click(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-smsLinkOption"));

        return this;
    }

    public CrossDeviceLink clickLinkOption() {
        click(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkOption"));
        return this;
    }

    public CrossDeviceLink clickCopyLink() {
        click(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-copyToClipboard"));
        return this;
    }

    @Override
    protected By pageId() {
        return pageIdSelector("CrossDeviceLink");
    }
}
