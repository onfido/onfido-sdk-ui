@browser @sdk
Feature: SDK File Upload Tests

  Scenario: Test multiple tabs/windows
    Given I verify with passport
    When I click on cross_device_button ()
    Then page_title () should contain "Continue verification on your mobile"
    When I open cross_device_link () in a new tab
    Then page_title () should contain "Upload front of document"
    And master flow should show connected


  Scenario Outline: I should be able to upload a passport and an image of a face correctly.
    Given I verify with passport
    When I try to upload passport <type>
    Then page_title () should contain "Upload a selfie"
    When I try to upload one_face
    Then I should reach the complete step

    Examples:
      | type |
      |      |
      | pdf  |

  Scenario Outline: I should be able to upload a two-sided identity document and an image of a face correctly.
    Given I verify with identity_card
    When I try to upload national_identity_card <type>
    Then page_title () should contain "Upload back of document"
    When I try to upload back_national_identity_card <type>
    Then page_title () should contain "Upload a selfie"
    When I try to upload one_face


    Examples:
      | type |
      |      |
      | pdf  |

  Scenario Outline: I should be able to upload a two-sided driving license and an image of a face correctly.
    Given I verify with drivers_license
    When I try to upload uk_driving_licence <type>
    Then page_title () should contain "Upload back of document"
    When I try to upload back_driving_licence <type>
    Then page_title () should contain "Upload a selfie"
    When I try to upload one_face
    Then I should reach the complete step

    Examples:
      | type |
      |      |
      | pdf  |

  Scenario Outline: I should not be able to upload a document which is clearly not a passport.
    Given I verify with passport
    When I try to upload llama <type>
    Then I should see uploaded_<type>image ()
    And error_message () should contain "No document detected"
    And error_instruction () should contain "Make sure all the document is in picture"

    Examples:
      | type |
      |      |
      | pdf  |

  Scenario: I should not be able to upload a document over 10MB.
    Given I verify with passport
    When I upload over_10mb_face on file_upload ()
    Then upload_error_message () should contain "File size too large. Size needs to be smaller than 10MB."

  Scenario: I should not be able to upload an image of a face over 10MB.
    Given I verify with passport
    When I try to upload passport
    Then page_title () should contain "Upload a selfie"
    When I upload over_10mb_face on file_upload ()
    Then upload_error_message () should contain "File size too large. Size needs to be smaller than 10MB."

  Scenario: I should not be able to upload an unsupported type image of a face
    Given I verify with passport
    When I try to upload passport
    Then page_title () should contain "Upload a selfie"
    When I try to upload one_face pdf
    Then I should see uploaded_pdfimage ()
    And error_message () should contain "Unsupported file type"
    And error_instruction () should contain "Try using a .jpg or .png file"

  Scenario: I should not be able to upload an image containing multiple faces
    Given I verify with passport
    When I try to upload passport
    Then page_title () should contain "Upload a selfie"
    When I try to upload two_faces
    Then I should see uploaded_image ()
    And error_message () should contain "Multiple faces found"
    And error_instruction () should contain "Only your face can be in the selfie"

  Scenario: I should see the glare was detected on front and back of a document
    Given I verify with drivers_license
    When I try to upload document_with_glare
    Then I should see uploaded_image ()
    And error_message () should contain "Glare detected"
    And error_instruction () should contain "All details should be clear and readable"
    When I click on confirm ()
    Then page_title () should contain "Upload back of document"
    When I try to upload back_document_with_glare
    Then I should see uploaded_image ()
    And error_message () should contain "Glare detected"
    And error_instruction () should contain "All details should be clear and readable"
    When I click on confirm ()
    Then page_title () should contain "Upload a selfie"

  Scenario Outline: I can use the take again functionality if I'm not happy with the image I uploaded.
    Given I verify with passport
    When I try to upload passport <type> and then retry
    Then page_title () should contain "Upload front of document"
    When I try to upload passport <type>
    Then page_title () should contain "Upload a selfie"
    When I try to upload one_face and then retry
    Then page_title () should contain "Upload a selfie"
    When I try to upload one_face
    Then I should reach the complete step

    Examples:
      | type |
      |      |
      | pdf  |

  Scenario: I can navigate to the second-last step of the flow and then go back to the beginning
    Given I verify with passport
    When I try to upload passport
    Then page_title () should contain "Upload a selfie"
    When I upload one_face on file_upload ()
    Then I can navigate back to the previous page with title "Upload a selfie"
    Then I can navigate back to the previous page with title "Confirm capture"
    Then I can navigate back to the previous page with title "Upload front of document"
    Then I can navigate back to the previous page with title "Verify your identity"
    Then I can navigate back to the previous page with title "Open your new bank account"
    Then I should not see "back"
