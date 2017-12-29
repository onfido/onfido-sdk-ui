@browser
Feature: SDK Cross device steps

  Scenario: Test cross device flow
    Given I verify with passport
    When I click on cross_device_button ()
    Then page_title should include "cross_device.link.title"
    When I open cross_device_link () in a new tab
    Then page_title should include "capture.passport.front.title"
    When I switch to tab 1
    Then I wait until page_title has "cross_device.mobile_connected.title.message"
    When I switch to tab 2
    And I upload my document and selfie
    Then page_title should include "cross_device.client_success.title"
    When I switch to tab 1
    Then I wait for 1 second
    Then page_title should include "cross_device.submit.title"
    When I click on primary_button ()
    Then page_title should include "complete.message"
