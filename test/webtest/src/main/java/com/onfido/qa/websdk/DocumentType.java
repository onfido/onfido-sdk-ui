package com.onfido.qa.websdk;

import java.util.Arrays;

public enum DocumentType implements IDocumentType {

    DRIVING_LICENCE("driving_licence", 2),
    IDENTITY_CARD("national_identity_card", 2),
    PASSPORT("passport", 1),
    RESIDENT_PERMIT("residence_permit", 2);

    private final String canonicalName;
    private final int numberOfSides;

    DocumentType(String name, int numberOfSides) {
        this.canonicalName = name;
        this.numberOfSides = numberOfSides;
    }

    public boolean isSingleSideDocument() {
        return numberOfSides == 1;
    }

    public boolean isDoubleSideDocument() {
        return numberOfSides == 2;
    }

    @Override
    public String canonicalName() {
        return canonicalName;
    }

    public static DocumentType fromCanonicalName(String canonicalName) {

        return Arrays.stream(values())
                     .filter(x -> x.canonicalName.equalsIgnoreCase(canonicalName))
                     .findFirst()
                     .orElseThrow(() -> new IllegalArgumentException(String.format("No DocumentType with name '%s' available.", canonicalName)));
    }
}
