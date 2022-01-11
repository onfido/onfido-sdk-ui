package com.onfido.qa.websdk.page;

import com.onfido.qa.webdriver.Driver;
import com.onfido.qa.websdk.UploadDocument;
import com.onfido.qa.websdk.util.Javascript;
import org.openqa.selenium.By;

import java.io.File;
import java.io.IOException;

public abstract class DocumentUploadBasePage extends BasePage {

    protected static final By FILE_INPUT = By.cssSelector(".onfido-sdk-ui-CustomFileInput-input");

    protected DocumentUploadBasePage(Driver driver) {
        super(driver);
    }

    public ConfirmUpload upload(UploadDocument document) {

        String path = path(document);

        var input = driver.findElement(FILE_INPUT);

        new Javascript(driver).changeDisplayStyle(input, "block");
        input.sendKeys(path);

        return new ConfirmUpload(driver);
    }

    private String path(UploadDocument document) {
        var directory = new File("../resources/");

        var file = new File(directory, document.filename);
        try {
            return file.getCanonicalPath();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
