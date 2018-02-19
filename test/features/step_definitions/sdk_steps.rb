require_relative '../helpers/i18n_helper.rb'

i18n = I18nHelper.new

Given(/^I verify with (passport|identity_card|drivers_license)(?:| with (.+)?)$/) do |document_type, locale|
  i18n.load_locale(locale)

  if document_type == 'passport'
    key = 'capture.passport.front.title'
  elsif document_type == 'identity_card'
    key = 'capture.national_identity_card.front.title'
  elsif document_type == 'drivers_license'
    key = 'capture.driving_licence.front.title'
  end

  steps %Q{
    Given I navigate to the SDK with "#{locale}"
    When I click on primary_button (SDK)
    Then I should see 3 document_select_buttons ()
    When I click on #{document_type} ()
    Then page_title should include translation for "#{key}"
    And cross_device_header should include translation for "cross_device.switch_device.header"
  }
end

When(/^I try to upload (\w+)(?:\s*)(pdf)?( and then retry)?$/) do |document, file_type, should_retry|
  action_button = should_retry ? "take_again" : "confirm"
  if document.include?('passport') || document.include?('llama')
    doc = 'confirm.passport.message'
  elsif document.include? 'identity_card'
    doc = 'confirm.national_identity_card.message'
  elsif document.include?('license') || document.include?('licence')
    doc = 'confirm.driving_licence.message'
  end
  face = 'confirm.face.message'

  confirm_key = doc ? doc : face

  steps %Q{
    When I upload #{document} #{file_type} on file_upload ()
    Then I should see uploaded_#{file_type}image ()
    And sub_title should include translation for "#{confirm_key}"
    When I click on #{action_button} ()
  }
end

Then(/^I should reach the complete step$/) do
  steps %Q{
    Then page_title should include translation for "complete.message"
    Then page should not have back buttons
  }
end

Then(/^I can navigate back to the previous page with title "([^"]*)"$/) do | key |
  steps %Q{
    When I click on back ()
    Then page_title should include translation for "#{key}"
  }
end

When(/^I upload my document and selfie$/) do
  steps %Q{
    When I try to upload passport
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload one_face
  }
end

Then(/^(.*) should include translation for "([^"]*)"$/) do | page_element, key|
  text = i18n.translate(key)
  steps %Q{
    Then #{page_element} () should contain "#{text}"
  }
end

Then(/page should not have back buttons$/) do
  #This won't throw an exeption and will save time
  expect(@driver.find_elements(:css, '.onfido-sdk-ui-NavigationBar-back').size()).to eq 0
end

Then(/^I wait until (.*) has "([^"]*)"$/) do | page_element, key |
  text = i18n.translate(key)
  steps %Q{
    Then I wait until #{page_element} () contains "#{text}"
  }
end
