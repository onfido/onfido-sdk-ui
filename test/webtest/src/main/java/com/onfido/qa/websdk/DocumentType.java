package com.onfido.qa.websdk;

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
}
