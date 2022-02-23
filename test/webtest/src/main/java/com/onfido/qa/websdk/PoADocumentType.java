package com.onfido.qa.websdk;

import java.util.function.Function;

import static com.onfido.qa.websdk.PoADocumentType.Helper.isNonUK;
import static com.onfido.qa.websdk.PoADocumentType.Helper.isUK;

public enum PoADocumentType implements IDocumentType {

    BANK_BUILDING_SOCIETY_STATEMENT("bank_building_society_statement", isUK),
    UTILITY_BILL("utility_bill", isUK),
    COUNCIL_TAX("council_tax", isUK),
    BENEFIT_LETTERS("benefit_letters", isUK),
    GOVERNMENT_LETTER("government_letter", isNonUK);

    public final String canonicalName;
    private final Function<String, Boolean> availableInCountry;

    PoADocumentType(String name, Function<String, Boolean> availableInCountry) {
        this.canonicalName = name;
        this.availableInCountry = availableInCountry;
    }

    @Override
    public String canonicalName() {
        return canonicalName;
    }

    public boolean availableInCountry(String countryCode) {
        return availableInCountry.apply(countryCode);
    }

    public static final class Helper {
        public static final Function<String, Boolean> isUK = countryCode -> countryCode.equalsIgnoreCase("GBR");
        public static final Function<String, Boolean> isNonUK = countryCode -> !countryCode.equalsIgnoreCase("GBR");

        private Helper() {
        }
    }

}
