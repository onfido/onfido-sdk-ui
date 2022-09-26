package com.onfido.qa.websdk.mock.config;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.onfido.qa.websdk.DocumentType;

import java.util.List;

@SuppressWarnings("PublicField")
public class UploadDocumentConfig extends ConfigBase {

    public static final int DEFAULT_TIMEOUT = 1209600;

    @JsonProperty("nfc_enabled")
    public boolean nfcEnabled = true;

    @JsonProperty
    public int timeout = DEFAULT_TIMEOUT;

    @JsonProperty("document_selection")
    public List<DocumentSelection> documentSelections;

    public UploadDocumentConfig(List<DocumentSelection> documentSelections) {
        this.documentSelections = documentSelections;
    }

    public static class DocumentSelection {

        @JsonProperty
        public Object config;

        public DocumentType documentType;

        @JsonProperty("document_type")
        private String _documentType() {
            return documentType.canonicalName();
        }

        @JsonProperty("issuing_country")
        public String issuingCountry;

        public DocumentSelection(DocumentType documentType, String issuingCountry) {
            this.documentType = documentType;
            this.issuingCountry = issuingCountry;
        }
    }
}
