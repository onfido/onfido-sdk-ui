@browser
Feature: SDK File Upload Tests

  Scenario Outline: I can navigate to the second-last step of the flow and then go back to the beginning
    Given I verify with passport with <locale>
    When I try to upload passport
    Then page_title should include translation for "capture.face.upload_title"
    When I upload one_face
    Then I can navigate back to the previous page with title "capture.face.upload_title"
    Then I can navigate back to the previous page with title "confirm.document.title"
    Then I can navigate back to the previous page with title "capture.passport.front.title"
    Then I can navigate back to the previous page with title "document_selector.identity.title"
    Then I can navigate back to the previous page with title "welcome.title"
    Then I should not see back ()

    Examples:
      | locale |
      |        |
      | es     |

  Scenario: I should be able to open, close and open the sdk again as a modal
    Given I navigate to the SDK as a modal
    When I click on modal_button (SDK)
    Then I should see page_title ()
    When I press esc key
    When I click on modal_button ()
    Then I should see page_title ()

  Scenario Outline: I should be able to decline privacy terms
    Given I initiate the verification process with <locale>
    Then I should see 3 document_select_buttons ()
    When I click on passport ()
    Then I can decline privacy terms
    Then I can navigate back to the previous page with title "document_selector.identity.title"

    Examples:
      | locale |
      |        |
      | es     |


#   Until monster is updated to support launching Chrome with arguments (--use-fake-ui-for-media-stream, --use-fake-device-for-media-stream)
#   this test will fail in Travis	#   this full test will fail in Travis
#	#
 Scenario Outline: I should enter the liveness flow if I have a camera and liveness variant requested
   Given I initiate the verification process using liveness with <locale>
   And I do have a camera
   When I click on passport ()
   When I try to upload passport
   Then page_title should include translation for "capture.liveness.intro.title"
   When I click on primary_button ()
#   Then I see the camera permissions priming screen

   Examples:
     | locale |
     |        |
     | es     |

 Scenario Outline: I should be taken to the cross-device flow if I do not have a camera and liveness variant requested
   Given I initiate the verification process using liveness with <locale>
   And I do not have a camera
   When I click on passport ()
   When I try to upload passport
   Then page_title should include translation for "cross_device.intro.face.title"

   Examples:
     | locale |
     |        |
     | es     |

  Scenario Outline: I should be taken to the selfie screen if browser does not have MediaRecorder API and liveness variant requested
    Given I initiate the verification process using liveness with <locale>
    And I do have a camera
    And I am not using a browser with MediaRecorder API
    Then I am taken to the selfie screen

    Examples:
      | locale |
      |        |
      | es     |