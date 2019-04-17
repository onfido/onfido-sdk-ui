require_relative '../helpers/i18n_helper.rb'

i18n = I18nHelper.new

Given(/^I navigate to the SDK with PoA feature enabled$/) do
  open_sdk(@driver, { 'poa' => true, 'useWebcam' => false })
end

Then(/^I navigate to document selection screen and verify UI elements$/) do

  bank_statement_cell = 'Bank/Building Society Statemente-statements accepted'
  utility_bill_cell = 'Utility Bill'
  council_tax_letter_cell = 'Council Tax Letter'
  benefits_letter_cell = 'Benefits Letter'
  bank_statement_cell_title = 'Bank/Building Society Statement'
  utility_bill_cell_title = 'Utility Bill'
  council_tax_letter_cell_title = 'Council Tax Letter'
  benefits_letter_cell_title = 'Benefits Letter'
  bank_statement_icon = 'bank-building-society-statement'
  utility_bill_icon = 'utility-bill'

  steps %Q{
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see poc_document_cell(#{bank_statement_cell}) (POA)
    Then I should see poc_document_cell(#{utility_bill_cell}) (POA)
    Then I should see poc_document_cell(#{council_tax_letter_cell}) (POA)
    Then I should see poc_document_cell(#{benefits_letter_cell}) (POA)
    Then I should see poc_document_cell_title(#{bank_statement_cell_title}) (POA)
    Then I should see poc_document_cell_title(#{utility_bill_cell_title}) (POA)
    Then I should see poc_document_cell_title(#{council_tax_letter_cell_title}) (POA)
    Then I should see poc_document_cell_title(#{benefits_letter_cell_title}) (POA)
    Then I should see poc_document_icon(#{bank_statement_icon}) (POA)
    Then I should see poc_document_icon(#{utility_bill_icon}) (POA)
    Then I should see council_tax_letter_icon (POA)
    Then I should see benefits_letter_icon (POA)
    Then I should see bank_building_statement_subtitle (POA)
    Then I should see utility_bill_subtitle (POA)
    Then I should see benefits_letter_subtitle (POA)
  }
end

When(/^I navigate to poa document upload screen after selecting(?: (.+)?)?$/) do |poa_document|

  if poa_document === 'poc_document_cell(Bank/Building Society Statemente-statements accepted)'
    title = 'Bank Statement'
  elsif poa_document === 'poc_document_cell(Utility Bill)'
    title = 'Utility Bill'
  elsif poa_document === 'poc_document_cell(Council Tax Letter)'
    title = 'Council Tax Letter'
  elsif poa_document === 'poc_document_cell(Benefits Letter)'
    title = 'Benefits Letter'
  end

  steps %Q{
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    When I click on #{poa_document} (POA)
    Then I should see document_upload_intro_screen(#{title}) (POA)
    When I click on continue_button (POA)
  }
end

When(/^I navigate to poa document upload intro screen and verify UI elements after selecting(?: (.+)?)?$/) do |poa_document|

  if poa_document === 'poc_document_cell(Bank/Building Society Statemente-statements accepted)'
    months_message = 'Must be issued in the last 3 months'
    clear_text_message = 'Make sure it clearly shows:'
  elsif poa_document === 'poc_document_cell(Utility Bill)'
    months_message = 'Must be issued in the last 3 months'
    clear_text_message = 'Make sure it clearly shows:'
  elsif poa_document === 'poc_document_cell(Council Tax Letter)'
    months_message = 'Must be issued in the last 12 months'
    clear_text_message = 'Make sure it clearly shows:'
  elsif poa_document === 'poc_document_cell(Benefits Letter)'
    months_message = 'Must be issued in the last 12 months'
    clear_text_message = 'Make sure it clearly shows:'
  end

  steps %Q{
    When I click on primary_button (SDK)
    When I click on start_verification_button (POA)
    Then I should see document_selection_screen_title (POA)
    Then I should see document_selection_screen_subtitle (POA)
    When I click on #{poa_document} (POA)
    Then I should see document_issued_last_months_text(#{months_message}) (POA)
    Then I should see make_sure_clear_text(#{clear_text_message}) (POA)
    Then I should see document_fields_points_list_text (POA)
  }
end
