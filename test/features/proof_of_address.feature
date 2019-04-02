@browser
Feature: SDK proof of address

  Scenario: Test presence of the UI elements of the second screen of the PoA flow
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    Then I should see verify_uk_address_title (POA)
    Then I should see need_a_doc_text (POA)
    Then I should see bullet_1 (POA)
    Then I should see bullet_2 (POA)
    Then I should see bullet_3 (POA)

  Scenario: Test navigation to the document selection screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see document_selection_screen_title (POA)
