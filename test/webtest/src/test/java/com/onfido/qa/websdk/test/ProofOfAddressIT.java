package com.onfido.qa.websdk.test;

import com.onfido.qa.websdk.PoADocumentType;
import com.onfido.qa.websdk.page.Complete;
import com.onfido.qa.websdk.model.Option;
import com.onfido.qa.websdk.page.PoAIntro;
import org.testng.SkipException;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.EnumMap;
import java.util.Map;

import static com.google.common.truth.Truth.assertThat;
import static com.onfido.qa.websdk.PoADocumentType.BANK_BUILDING_SOCIETY_STATEMENT;
import static com.onfido.qa.websdk.PoADocumentType.BENEFIT_LETTERS;
import static com.onfido.qa.websdk.PoADocumentType.COUNCIL_TAX;
import static com.onfido.qa.websdk.PoADocumentType.UTILITY_BILL;
import static com.onfido.qa.websdk.PoADocumentType.values;
import static com.onfido.qa.websdk.UploadDocument.NATIONAL_IDENTITY_CARD_PDF;

@SuppressWarnings("StaticCollection")
public class ProofOfAddressIT extends WebSdkIT {

    @DataProvider(name = "poaDocumentTypes")
    public static Object[][] poaDocumentTypes() {

        return Arrays.stream(values()).map(x -> {
            return new Object[]{x};
        }).toArray(Object[][]::new);
    }

    final static Map<PoADocumentType, Option> expectedOptions = new EnumMap<>(PoADocumentType.class);
    final static Map<PoADocumentType, String> expectedTitle = new EnumMap<>(PoADocumentType.class);

    static {
        expectedOptions.put(BANK_BUILDING_SOCIETY_STATEMENT, new Option("Bank or building society statement", null, null, true));
        expectedOptions.put(UTILITY_BILL, new Option("Utility Bill", "Gas, electricity, water, landline, or broadband", "Sorry, no mobile phone bills", true));
        expectedOptions.put(COUNCIL_TAX, new Option("Council Tax Letter", null, null, false));
        expectedOptions.put(BENEFIT_LETTERS, new Option("Benefits Letter", "Government authorised household benefits eg. Jobseeker allowance, Housing benefit, Tax credits", null, false));

        expectedTitle.put(BANK_BUILDING_SOCIETY_STATEMENT, "doc_submit.title_bank_statement");
        expectedTitle.put(UTILITY_BILL, "doc_submit.title_bill");
        expectedTitle.put(COUNCIL_TAX, "doc_submit.title_tax_letter");
        expectedTitle.put(BENEFIT_LETTERS, "doc_submit.title_government_letter");

    }

    @Test(description = "should verify PoA flow for different poa document types", dataProvider = "poaDocumentTypes")
    public void testPoAUIElements(PoADocumentType documentType) {

        // TODO: bootstrap with an applicant from country, that is required by the document type
        if (!documentType.availableInCountry("GBR")) {
            throw new SkipException(String.format("Cannot execute test, as the document type '%s' is not available in this country", documentType.name()));
        }

        var intro = onfido().withSteps("poa", "complete").init(PoAIntro.class);

        assertThat(intro.title()).isEqualTo("Let’s verify your UK address");

        verifyCopy(intro.requirementsHeader(), "poa_intro.subtitle");
        assertThat(intro.firstRequirement()).isEqualTo("Shows your current address");
        assertThat(intro.secondRequirement()).isEqualTo("Matches the address you used on signup");
        assertThat(intro.thirdRequirement()).isEqualTo("Is your most recent document");

        verifyCopy(intro.startVerificationButtonText(), "poa_intro.button_primary");

        var documentSelection = intro.startVerification();

        assertThat(documentSelection.title()).isEqualTo("Select a UK document");
        verifyCopy(documentSelection.subTitle(), "doc_select.subtitle_poa");

        var option = documentSelection.getOption(documentType);
        assertThat(option).isEqualTo(expectedOptions.get(documentType));

        var guidance = documentSelection.select(documentType);

        verifyCopy(guidance.title(), expectedTitle.get(documentType));
        verifyCopy(guidance.makeSure(), "poa_guidance.instructions.label");
        verifyCopy(guidance.logoText(), "poa_guidance.instructions.logo");
        verifyCopy(guidance.continueButtonText(), "poa_guidance.button_primary");

        var upload = guidance.clickContinue();

        upload.upload(NATIONAL_IDENTITY_CARD_PDF).clickConfirmButton(Complete.class);

        // TODO: why do the original tests now continue with the document upload?
    }

}
