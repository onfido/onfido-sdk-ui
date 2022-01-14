package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.util.ByUtil;
import org.openqa.selenium.By;

public class CrossDeviceLink extends BasePage {

    public static final By PHONE_NUMBER = By.cssSelector(".onfido-sdk-ui-PhoneNumberInput-phoneNumberContainer #phoneNumberInput");

    public CrossDeviceLink(Driver driver) {
        super(driver);
    }

    public String copyLink() {

        clickCopyLink();
        return text(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-linkText"));

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

    private CrossDeviceLink clickCopyLink() {
        click(By.cssSelector(".onfido-sdk-ui-crossDevice-CrossDeviceLink-copyLinkOption"));
        return this;
    }

    @Override
    protected By pageId() {
        return pageIdSelector("CrossDeviceLink");
    }
}
