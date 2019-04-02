@browser
Feature: SDK proof of address

  Scenario: Test cross device flow
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    Then I should see verify_uk_address_title (POA)
