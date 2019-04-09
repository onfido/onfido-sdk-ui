@browser
Feature: Proof of address

  Scenario Outline: Test file upload for PoC docs
    Given I navigate to the SDK with PoA feature enabled
    When I navigate to poa document upload screen after selecting <poa_document>
# currently we don't run validation of the uploaded documents hence we upload id
    When I upload national_identity_card
    Then I should see poa_upload_confirmation_title (POA)
    Then I should see poa_upload_confirmation_subtitle (POA)

    Examples:
      | poa_document                  |
      | bank_building_statement_cell  |
      | utility_bill_cell             |
      | council_tax_letter_cell       |
      | benefits_letter_cell          |

  Scenario: Test presence of the UI elements of the second screen of the PoA flow
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    Then I should see verify_uk_address_title (POA)
    Then I should see need_a_doc_text (POA)
    Then I should see poa_requirements (POA)

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

  Scenario Outline: Test presence of the UI elements on PoA upload intro screen 3 months
    Given I navigate to the SDK with PoA feature enabled
    When I navigate to poa document upload intro screen after selecting <poa_document>
    Then I should see document_issued_last_3_months_text (POA)
    Then I should see make_sure_clear_text (POA)
    Then I should see document_fields_points_list_text (POA)

    Examples:
      | poa_document                  |
      | bank_building_statement_cell  |
      | utility_bill_cell             |

  Scenario Outline: Test presence of the UI elements on PoA upload intro screen 12 months
    Given I navigate to the SDK with PoA feature enabled
    When I navigate to poa document upload intro screen after selecting <poa_document>
    Then I should see document_issued_last_12_months_text (POA)
    Then I should see make_sure_clear_text (POA)
    Then I should see document_fields_points_list_text (POA)

    Examples:
      | poa_document                  |
      | council_tax_letter_cell       |
      | benefits_letter_cell          |
