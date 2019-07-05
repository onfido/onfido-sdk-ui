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
    | poa_document                 |
    | bank_building_statement_cell |
    | utility_bill_cell            |
    | benefits_letter_cell         |
    | council_tax_letter_cell      |

  Scenario Outline: Test presence of the UI elements on document upload intro screen
    Given I navigate to the SDK with PoA feature enabled
    When I navigate to poa document upload intro screen and verify UI elements after selecting <poa_document>

    Examples:
      | poa_document                 |
      | bank_building_statement_cell |
      | utility_bill_cell            |
      | council_tax_letter_cell      |
      | benefits_letter_cell         |
