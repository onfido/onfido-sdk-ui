require_relative '../helpers/i18n_helper.rb'

Given(/^I verify with (passport|identity_card|drivers_license)$/) do |document_type|
  if document_type == 'passport'
    title = I18nHelper.translate('capture.passport.front.title')
  elsif document_type == 'identity_card'
    title = I18nHelper.translate('capture.national_identity_card.front.title')
  elsif document_type == 'drivers_license'
    title = I18nHelper.translate('capture.driving_licence.front.title')
  end

  steps %Q{
    Given I navigate to the SDK
    When I click on primary_button (SDK)
    Then I should see 3 document_select_buttons ()
    When I click on #{document_type} ()
    Then page_title () should contain "#{title}"
    And cross_device_header () should contain "#{I18nHelper.translate('cross_device.switch_device.header')}"
  }
end

When(/^I try to upload (\w+)(?:\s*)(pdf)?( and then retry)?$/) do |document, file_type, should_retry|
  action_button = should_retry ? "take_again" : "confirm"
  if document.include?('passport') || document.include?('llama')
    doc = I18nHelper.translate('confirm.passport.message')
  elsif document.include? 'identity_card'
    doc = I18nHelper.translate('confirm.national_identity_card.message')
  elsif document.include?('license') || document.include?('licence')
    doc = I18nHelper.translate('confirm.driving_licence.message')
  end
  face = I18nHelper.translate('confirm.face.message')

  confirm_text = doc ? doc : face

  steps %Q{
    When I upload #{document} #{file_type} on file_upload ()
    Then I should see uploaded_#{file_type}image ()
    And sub_title () should contain "#{confirm_text}"
    When I click on #{action_button} ()
  }
end

Then(/^I should reach the complete step$/) do
  steps %Q{
    Then page_title () should contain "#{I18nHelper.translate('complete.message')}"
    Then I should not see "#{I18nHelper.translate('back')}"
  }
end

Then(/^I can navigate back to the previous page with title "([^"]*)"$/) do | key |
  title = I18nHelper.translate(key)
  steps %Q{
    When I click on back ()
    Then page_title () should contain "#{title}"
  }
end

When(/^I upload my document and selfie$/) do
  selfie = I18nHelper.translate('capture.face.upload_title')
  steps %Q{
    When I try to upload passport
    Then page_title () should contain "#{selfie}"
    When I try to upload one_face
  }
end

Then(/^(.*) should include "([^"]*)"$/) do | page_element, key|
  translation = I18nHelper.translate(key)

  steps %Q{
    Then #{page_element} () should contain "#{translation}"
  }
end
