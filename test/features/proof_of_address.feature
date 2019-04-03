@browser
Feature: SDK proof of address

  Scenario: Test presence of the UI elements of the second screen of the PoA flow
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    Then I should see verify_uk_address_title (POA)
    Then I should see need_a_doc_text (POA)
    Then I should see bullet_points (POA)

  Scenario: Test navigation to the document selection screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see document_selection_screen_title (POA)
    Then I should see document_selection_screen_subtitle (POA)

  Scenario: Test presence of the UI elements of the bank/building society statement cell
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see bank_building_statement_icon (POA)
    Then I should see bank_building_statement_title (POA)
    Then I should see bank_building_statement_subtitle (POA)

  Scenario: Test presence of the UI elements of the utility bill cell
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see utility_bill_icon (POA)
    Then I should see utility_bill_title (POA)
    Then I should see utility_bill_subtitle (POA)

  Scenario: Test presence of the UI elements of the council tax letter cell
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see council_tax_letter_icon (POA)
    Then I should see council_tax_letter_title (POA)

  Scenario: Test presence of the UI elements of the benefits letter cell
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see benefits_letter_icon (POA)
    Then I should see benefits_letter_title (POA)
    Then I should see benefits_letter_subtitle (POA)

  Scenario: Test navigation to the bank statement upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on bank_building_statement_cell (POA)
    Then I should see document_upload_intro_screen_bank_statement_title (POA)

  Scenario: Test navigation to the utility bill upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on utility_bill_cell (POA)
    Then I should see document_upload_intro_screen_utility_bill_title (POA)

  Scenario: Test navigation to the council tax letter upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on council_tax_letter_cell (POA)
    Then I should see document_upload_intro_screen_council_tax_letter_title (POA)

  Scenario: Test navigation to the benefits letter upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on benefits_letter_cell (POA)
    Then I should see document_upload_intro_screen_benefits_letter_title (POA)
