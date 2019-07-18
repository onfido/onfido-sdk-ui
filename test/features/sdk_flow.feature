@browser
Feature: SDK File Upload Tests

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

