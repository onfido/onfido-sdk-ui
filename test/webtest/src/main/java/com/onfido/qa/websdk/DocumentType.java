package com.onfido.qa.websdk;

public enum DocumentType implements IDocumentType {

    DRIVING_LICENCE("driving_licence"),
    IDENTITY_CARD("national_identity_card"),
    PASSPORT("passport"),
    RESIDENT_PERMIT("residence_permit");

    private final String canonicalName;

    DocumentType(String name) {
        this.canonicalName = name;
    }

    @Override
    public String canonicalName() {
        return canonicalName;
    }
}
