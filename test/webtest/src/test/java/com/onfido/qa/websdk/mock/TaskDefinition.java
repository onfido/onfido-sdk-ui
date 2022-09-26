package com.onfido.qa.websdk.mock;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum TaskDefinition {

    @JsonProperty("upload_document")
    UPLOAD_DOCUMENT,

    @JsonProperty("upload_document_photo")
    UPLOAD_DOCUMENT_PHOTO,

    @JsonProperty("upload_face_photo")
    UPLOAD_FACE_PHOTO,

    @JsonProperty("upload_face_video")
    UPLOAD_FACE_VIDEO,

    @JsonProperty("proof_of_address_capture")
    PROOF_OF_ADDRESS_CAPTURE,

    @JsonProperty("profile_data")
    PROFILE_DATA,

    @JsonProperty("retry")
    RETRY,

}
