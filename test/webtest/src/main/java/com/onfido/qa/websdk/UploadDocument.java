package com.onfido.qa.websdk;

public enum UploadDocument {

    BACK_DRIVING_LICENCE_JPG("back_driving_licence.jpg"),
    BACK_DRIVING_LICENCE_PDF("back_driving_licence.pdf"),
    BACK_NATIONAL_IDENTITY_CARD_JPG("back_national_identity_card.jpg"),
    BACK_NATIONAL_IDENTITY_CARD_PDF("back_national_identity_card.pdf"),
    FACE("face.jpeg"),
    IDENTITY_CARD_WITH_CUT_OFF("identity_card_with_cut-off.png"),
    IDENTITY_CARD_WITH_CUT_OFF_GLARE("identity_card_with_cut-off_glare.png"),
    IDENTITY_CARD_WITH_GLARE("identity_card_with_glare.jpg"),
    LLAMA_JPG("llama.jpg"),
    LLAMA_PDF("llama.pdf"),
    NATIONAL_IDENTITY_CARD_JPG("national_identity_card.jpg"),
    NATIONAL_IDENTITY_CARD_PDF("national_identity_card.pdf"),
    ONE_FACE_JPG("one_face.jpg"),
    ONE_FACE_PDF("one_face.pdf"),
    ONE_FACE_PNG("one_face.png"),
    OVER_10MB_FACE("over_10mb_face.jpg"),
    OVER_10MB_PASSPORT("over_10mb_passport.jpg"),
    PASSPORT_JPG("passport.jpg"),
    PASSPORT_PDF("passport.pdf"),
    SAMPLE_10MB_PDF("sample-pdf-10-mb.pdf"),
    TEST_STREAM("test-stream.y4m"),
    TEST_VIDEO("test-video.webm"),
    TWO_FACES("two_faces.jpg"),
    UK_DRIVING_LICENCE_PDF("uk_driving_licence.pdf"),
    UK_DRIVING_LICENCE_PNG("uk_driving_licence.png"),
    UNSUPPORTED_FILE_TYPE("unsupported_file_type.txt");

    public final String filename;

    UploadDocument(String filename) {

        this.filename = filename;
    }
}
