require_relative '../helpers/i18n_helper.rb'

i18n = I18nHelper.new

Given(/^I navigate to the SDK with PoA feature enabled$/) do
  open_sdk(@driver, { 'poa' => true, 'useWebcam' => false })
end

When(/^I navigate to poa document upload screen after selecting(?: (.+)?)?$/) do |poa_document|

  if poa_document === 'bank_building_statement_cell'
    title = 'Bank Statement'
  elsif poa_document === 'utility_bill_cell'
    title = 'Utility Bill'
  elsif poa_document === 'council_tax_letter_cell'
    title = 'Council Tax Letter'
  elsif poa_document === 'benefits_letter_cell'
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

  if poa_document === 'bank_building_statement_cell'
    months_message = 'Must be issued in the last 3 months'
    clear_text_message = 'Make sure it clearly shows:'
  elsif poa_document === 'utility_bill_cell'
    months_message = 'Must be issued in the last 3 months'
    clear_text_message = 'Make sure it clearly shows:'
  elsif poa_document === 'council_tax_letter_cell'
    months_message = 'Must be issued in the last 12 months'
    clear_text_message = 'Make sure it clearly shows:'
  elsif poa_document === 'benefits_letter_cell'
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
