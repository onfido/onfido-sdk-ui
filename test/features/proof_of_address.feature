@browser
Feature: Proof of address

  Scenario Outline: Test file upload for PoC docs
    Given I navigate to the SDK with PoA feature enabled
    When I navigate to poa document upload screen after selecting <poa_document>
# currently we don't run validation of the uploaded documents hence we upload id
    Then I upload national_identity_card
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

  Scenario: Test presence of the UI elements on the PoA document selection screen
    Given I navigate to the SDK with PoA feature enabled
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see bank_building_statement_icon (POA)
    Then I should see bank_building_statement_title (POA)
    Then I should see bank_building_statement_subtitle (POA)
    Then I should see utility_bill_icon (POA)
    Then I should see utility_bill_title (POA)
    Then I should see utility_bill_subtitle (POA)
    Then I should see council_tax_letter_icon (POA)
    Then I should see council_tax_letter_title (POA)
    Then I should see benefits_letter_icon (POA)
    Then I should see benefits_letter_title (POA)
    Then I should see benefits_letter_subtitle (POA)

  Scenario Outline: Test presence of the UI elements on document upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I navigate to poa document upload intro screen and verify UI elements after selecting <poa_document>

    Examples:
      | poa_document                  |
      | bank_building_statement_cell  |
      | utility_bill_cell             |
      | council_tax_letter_cell       |
      | benefits_letter_cell          |
