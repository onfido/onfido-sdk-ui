package com.onfido.qa.websdk.test;

import org.testng.annotations.DataProvider;
import org.testng.annotations.Factory;

public class FactoryTests {

    @Factory(dataProvider = "languages")
    public Object[] createInstances(String str) {
        return new Object[]{new CountrySelectorIT(str)};
    }

    @DataProvider()
    public static Object[][] languages() {
        return new Object[][]{
                new Object[]{"en_US"},
                new Object[]{"es_ES"}
        };
    }
}
