@browser
Feature: SDK File Upload Tests

  Scenario Outline: I should be able to upload a passport and an image of a face correctly.
    Given I verify with passport with <locale>
    When I try to upload passport <type>
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload one_face
    Then I should reach the complete step

    Examples:
      | type | locale |
      |      |        |
      | pdf  | es     |

  Scenario Outline: I should be able to upload a two-sided identity document and an image of a face correctly.
    Given I verify with identity_card with <locale>
    When I try to upload national_identity_card <type>
    Then page_title should include translation for "capture.national_identity_card.back.title"
    When I try to upload back_national_identity_card <type>
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload one_face

    Examples:
      | type | locale |
      |      |        |
      | pdf  | es     |

  Scenario Outline: I should be able to upload a two-sided driving license and an image of a face correctly.
    Given I verify with drivers_license with <locale>
    When I try to upload uk_driving_licence <type>
    Then page_title should include translation for "capture.driving_licence.back.title"
    When I try to upload back_driving_licence <type>
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload one_face
    Then I should reach the complete step

    Examples:
      | type | locale |
      |      |        |
      | pdf  | es     |

  Scenario Outline: I should not be able to upload a document which is clearly not a passport.
    Given I verify with passport with <locale>
    When I try to upload llama <type>
    Then I should see uploaded_<type>image ()
    Then error_message should include translation for "errors.invalid_capture.message"
    And error_instruction should include translation for "errors.invalid_capture.instruction"

    Examples:
      | type | locale |
      |      |        |
      | pdf  | es     |

  Scenario Outline: I should not be able to upload a document over 10MB.
    Given I verify with passport with <locale>
    When I upload over_10mb_face on file_upload ()
    Then upload_error_message should include translation for "errors.invalid_size.message"

    Examples:
      | locale |
      |        |
      | es     |

  Scenario Outline:  I should not be able to upload an image of a face over 10MB.
    Given I verify with passport with <locale>
    When I try to upload passport
    Then page_title should include translation for "capture.face.upload_title"
    When I upload over_10mb_face on file_upload ()
    Then upload_error_message should include translation for "errors.invalid_size.message"

    Examples:
      | locale |
      |        |
      | es     |

  Scenario Outline: I should not be able to upload an unsupported type image of a face
    Given I verify with passport with <locale>
    When I try to upload passport
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload one_face pdf
    Then I should see uploaded_pdfimage ()
    And error_message should include translation for "errors.unsupported_file.message"
    And error_instruction should include translation for "errors.unsupported_file.instruction"

    Examples:
      | locale |
      |        |
      | es     |

  Scenario Outline: I should not be able to upload an image containing multiple faces
    Given I verify with passport with <locale>
    When I try to upload passport
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload two_faces
    Then I should see uploaded_image ()
    And error_message should include translation for "errors.multiple_faces.message"
    And error_instruction should include translation for "errors.multiple_faces.instruction"

    Examples:
      | locale |
      |        |
      | es     |

  Scenario Outline: I should see the glare was detected on front and back of a document
    Given I verify with identity_card with <locale>
    When I try to upload identity_card_with_glare
    Then I should see uploaded_image ()
    And error_message should include translation for "errors.glare_detected.message"
    And error_instruction should include translation for "errors.glare_detected.instruction"
    When I click on confirm ()
    Then page_title should include translation for "capture.national_identity_card.back.title"
    When I try to upload identity_card_with_glare
    Then I should see uploaded_image ()
    And error_message should include translation for "errors.glare_detected.message"
    And error_instruction should include translation for "errors.glare_detected.instruction"
    When I click on confirm ()
    Then page_title should include translation for "capture.face.upload_title"

    Examples:
      | locale |
      |        |
      | es     |

  Scenario Outline: I can use the take again functionality if I'm not happy with the image I uploaded.
    Given I verify with passport with <locale>
    When I try to upload passport <type> and then retry
    Then page_title should include translation for "capture.passport.front.title"
    When I try to upload passport <type>
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload one_face and then retry
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload one_face
    Then I should reach the complete step

    Examples:
      | type | locale |
      |      |        |
      | pdf  | es     |

  Scenario Outline: I can navigate to the second-last step of the flow and then go back to the beginning
    Given I verify with passport with <locale>
    When I try to upload passport
    Then page_title should include translation for "capture.face.upload_title"
    When I upload one_face on file_upload ()
    Then I can navigate back to the previous page with title "capture.face.upload_title"
    Then I can navigate back to the previous page with title "confirm.document.title"
    Then I can navigate back to the previous page with title "capture.passport.front.title"
    Then I can navigate back to the previous page with title "document_selector.title"
    Then I can navigate back to the previous page with title "welcome.title"
    Then page should not have back buttons

    Examples:
      | locale |
      |        |
      | es     |

  Scenario Outline: I should be able to open, close and open the sdk again as a modal
    Given I navigate to the SDK as a modal
    When I click on modal_button (SDK)
    Then I should see page_title ()
    When I press esc key
    When I click on modal_button ()
    Then I should see page_title ()

    Examples:
      | locale |
      |        |
