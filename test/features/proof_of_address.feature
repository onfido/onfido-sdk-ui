@browser
Feature: Proof of address

  Scenario: Test file upload for bank statement
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on benefits_letter_cell (POA)
    When I click on continue_button (POA)
    When I upload national_identity_card
    Then I should see poa_upload_confirmation_title (POA)
    Then I should see poa_upload_confirmation_subtitle (POA)

  Scenario: Test file upload for utility bill
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on utility_bill_cell (POA)
    When I click on continue_button (POA)
    When I upload passport
    Then I should see poa_upload_confirmation_title (POA)
    Then I should see poa_upload_confirmation_subtitle (POA)

  Scenario: Test file upload for council tax letter
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on utility_bill_cell (POA)
    When I click on continue_button (POA)
    When I upload french_passport
    Then I should see poa_upload_confirmation_title (POA)
    Then I should see poa_upload_confirmation_subtitle (POA)

  Scenario: Test file upload for benefits letter
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on benefits_letter_cell (POA)
    When I click on continue_button (POA)
    When I upload national_identity_card
    Then I should see poa_upload_confirmation_title (POA)
    Then I should see poa_upload_confirmation_subtitle (POA)

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

  Scenario: Test presence of the UI elements on bank statement upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on bank_building_statement_cell (POA)
    Then I should see document_issued_last_3_months_text (POA)
    Then I should see make_sure_clear_text (POA)
    Then I should see document_fields_points_list_text (POA)

  Scenario: Test presence of the UI elements on utility bill upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on utility_bill_cell (POA)
    Then I should see document_issued_last_3_months_text (POA)
    Then I should see make_sure_clear_text (POA)
    Then I should see document_fields_points_list_text (POA)

  Scenario: Test presence of the UI elements on council tax letter upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on council_tax_letter_cell (POA)
    Then I should see document_issued_last_12_months_text (POA)
    Then I should see make_sure_clear_text (POA)
    Then I should see document_fields_points_list_text (POA)

  Scenario: Test presence of the UI elements on benefits letter upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on benefits_letter_cell (POA)
    Then I should see document_issued_last_12_months_text (POA)
    Then I should see make_sure_clear_text (POA)
    Then I should see document_fields_points_list_text (POA)
