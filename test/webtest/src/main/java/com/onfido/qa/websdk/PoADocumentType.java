package com.onfido.qa.websdk;

import java.util.Arrays;
import java.util.function.Function;

import static com.onfido.qa.websdk.PoADocumentType.Helper.always;
import static com.onfido.qa.websdk.PoADocumentType.Helper.isUK;
import static com.onfido.qa.websdk.PoADocumentType.Helper.unavailable;

public enum PoADocumentType implements IDocumentType {

    BANK_BUILDING_SOCIETY_STATEMENT("bank_building_society_statement", always),
    UTILITY_BILL("utility_bill", always),
    COUNCIL_TAX("council_tax", isUK),
    BENEFIT_LETTERS("benefit_letters", isUK),
    GOVERNMENT_LETTER("government_letter", unavailable);

    public final String canonicalName;
    private final Function<String, Boolean> availableInCountry;

    PoADocumentType(String name, Function<String, Boolean> availableInCountry) {
        this.canonicalName = name;
        this.availableInCountry = availableInCountry;
    }

    public static PoADocumentType fromCanonicalName(String name) {

        return Arrays.stream(values())
                     .filter(x -> x.canonicalName.equalsIgnoreCase(name))
                     .findFirst()
                     .orElseThrow(() -> new IllegalArgumentException(String.format("No enum for canonical name '%s' found", name)));


    }

    @Override
    public String canonicalName() {
        return canonicalName;
    }

    public boolean availableInCountry(String countryCode) {
        return availableInCountry.apply(countryCode);
    }

    public static final class Helper {

        public static final Function<String, Boolean> always = countryCode -> true;
        public static final Function<String, Boolean> unavailable = countryCode -> false;
        public static final Function<String, Boolean> isUK = countryCode -> countryCode.equalsIgnoreCase("GBR");
        public static final Function<String, Boolean> isNonUK = countryCode -> !countryCode.equalsIgnoreCase("GBR");

        private Helper() {
        }
    }

}
