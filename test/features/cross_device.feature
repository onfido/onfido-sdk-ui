@browser
Feature: SDK Cross device steps

  Scenario: Test cross device flow
    Given I verify with passport
    When I click on cross_device_button ()
    Then page_title () should contain "Continue verification on your mobile"
    When I open cross_device_link () in a new tab
    Then page_title () should contain "Passport photo page"
    When I switch to tab 1
    Then I wait until page_title () contains "Connected to your mobile"
    When I switch to tab 2
    And I upload my document and selfie
    Then page_title () should contain "Uploads successful"
    When I switch to tab 1
    Then I wait for 1 second
    Then page_title () should contain "Great, that’s everything we need"
    When I click on primary_button ()
    Then page_title () should contain "Verification complete"
