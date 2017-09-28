@browser @sdk
Feature: SDK File Upload Tests

  Scenario Outline: I should be able to upload a passport and an image of a face correctly.
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    Then I should see 3 document_select_buttons ()
    When I click on passport ()
    Then page_title () should contain "Upload front of document"
    When I upload french_passport <type> on file_upload ()
    Then I should see uploaded_<type>image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload a picture of your face"
    When I upload one_face on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then complete_text () should contain "Verification complete"

    Examples:
      | type |
      |      |
      | pdf  |

  Scenario Outline: I should be able to upload a two-sided identity document and an image of a face correctly.
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    Then I should see 3 document_select_buttons ()
    When I click on identity_card ()
    Then page_title () should contain "Upload front of document"
    When I upload national_identity_card <type> on file_upload ()
    Then I should see uploaded_<type>image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload back of document"
    When I upload back_national_identity_card <type> on file_upload ()
    Then I should see uploaded_<type>image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload a picture of your face"
    When I upload one_face on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then complete_text () should contain "Verification complete"

    Examples:
      | type |
      |      |
      | pdf  |

  Scenario Outline: I should be able to upload a two-sided driving license and an image of a face correctly.
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    Then I should see 3 document_select_buttons ()
    When I click on drivers_license ()
    Then page_title () should contain "Upload front of document"
    When I upload uk_driving_licence <type> on file_upload ()
    Then I should see uploaded_<type>image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload back of document"
    When I upload back_driving_licence <type> on file_upload ()
    Then I should see uploaded_<type>image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload a picture of your face"
    When I upload one_face on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then complete_text () should contain "Verification complete"

    Examples:
      | type |
      |      |
      | pdf  |

  Scenario Outline: I should not be able to upload a document which is clearly not a passport.
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    And I click on passport ()
    Then page_title () should contain "Upload front of document"
    When I upload llama <type> on file_upload ()
    Then I should see uploaded_<type>image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then error_message () should contain "No document detected"
    And error_instruction () should contain "Make sure all the document is in picture"

    Examples:
      | type |
      |      |
      | pdf  |

  Scenario: I should not be able to upload a document over 10MB.
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    And I click on passport ()
    Then page_title () should contain "Upload front of document"
    When I upload over_10mb_face on file_upload ()
    Then upload_error_message () should contain "File size too large. Size needs to be smaller than 10MB."

  Scenario: I should not be able to upload an image of a face over 10MB.
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    And I click on passport ()
    Then page_title () should contain "Upload front of document"
    When I upload passport on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload a picture of your face"
    When I upload over_10mb_face on file_upload ()
    Then upload_error_message () should contain "File size too large. Size needs to be smaller than 10MB."

  Scenario: I should not be able to upload an unsupported type image of a face
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    And I click on passport ()
    Then page_title () should contain "Upload front of document"
    When I upload passport on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload a picture of your face"
    When I upload one_face pdf on file_upload ()
    Then I should see uploaded_pdfimage ()
    When I click on confirm ()
    Then error_message () should contain "Unsupported file type"
    And error_instruction () should contain "Try using a .jpg or .png file"

  Scenario: I should not be able to upload an image containing multiple faces
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    And I click on passport ()
    Then page_title () should contain "Upload front of document"
    When I upload passport on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload a picture of your face"
    When I upload two_faces on file_upload ()
    Then I should see uploaded_image ()
    When I click on confirm ()
    Then error_message () should contain "Multiple faces found"
    And error_instruction () should contain "Only your face can be in the selfie"

  Scenario: I should see the glare was detected on front and back of a document
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    And I click on drivers_license ()
    Then page_title () should contain "Upload front of document"
    When I upload document_with_glare on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then I should see uploaded_image ()
    And error_message () should contain "Glare detected"
    And error_instruction () should contain "All details should be clear and readable"
    When I click on confirm ()
    Then page_title () should contain "Upload back of document"
    When I upload back_document_with_glare on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then I should see uploaded_image ()
    And error_message () should contain "Glare detected"
    And error_instruction () should contain "All details should be clear and readable"
    When I click on confirm ()
    Then page_title () should contain "Upload a picture of your face"

  Scenario Outline: I can use the take again functionality if I'm not happy with the image I uploaded.
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    And I click on passport ()
    Then page_title () should contain "Upload front of document"
    When I upload french_passport <type> on file_upload ()
    Then I should see uploaded_<type>image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on take_again ()
    Then page_title () should contain "Upload front of document"
    When I upload french_passport <type> on file_upload ()
    Then I should see uploaded_<type>image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then page_title () should contain "Upload a picture of your face"
    When I upload one_face on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on take_again ()
    Then page_title () should contain "Upload a picture of your face"
    When I upload one_face on file_upload ()
    Then I should see uploaded_image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on confirm ()
    Then complete_text () should contain "Verification complete"

    Examples:
      | type |
      |      |
      | pdf  |
