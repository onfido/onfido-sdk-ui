package com.onfido.qa.websdk.util;

import org.openqa.selenium.By;

public final class ByUtil {

    private ByUtil() {
    }

    public static By pageId(String pageId) {
        return By.cssSelector("[data-page-id='" + pageId + "']");
    }

    public static By onfidoQa(String name) {
        return By.cssSelector(String.format("[data-onfido-qa='%s']", name));
    }
}
