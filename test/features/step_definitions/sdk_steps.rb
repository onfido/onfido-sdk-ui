require_relative '../helpers/i18n_helper.rb'

i18n = I18nHelper.new

Given(/^I initiate the verification process with(?: (.+)?)?$/) do |locale|
  i18n.load_locale(locale)
  steps %Q{
    Given I navigate to the SDK with "#{locale}"
    Then I click on primary_button (SDK)
  }
end

Given(/^I initiate the verification process using a webcam with(?: (.+)?)?$/) do |locale|
  i18n.load_locale(locale)
  steps %Q{
    Given I navigate to the SDK using a webcam with "#{locale}"
    Then I click on primary_button (SDK)
  }
end

Given(/^I verify with (passport|identity_card|drivers_license)(?: with (.+)?)?$/) do |document_type, locale|
  if document_type == 'passport'
    key = 'capture.passport.front.title'
  elsif document_type == 'identity_card'
    key = 'capture.national_identity_card.front.title'
  elsif document_type == 'drivers_license'
    key = 'capture.driving_licence.front.title'
  end

  steps %Q{
    Given I initiate the verification process with #{locale}
    Then I should see 3 document_select_buttons ()
    When I click on #{document_type} ()
    Then I can confirm privacy terms
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
    Then I should not see back ()
  }
end

Then(/^I can navigate back to the previous page with title "([^"]*)"$/) do | key |
  steps %Q{
    When I click on back ()
    Then page_title should include translation for "#{key}"
  }
end

When(/^I see the camera permissions priming screen$/) do
  steps %Q{
    Then page_title should include translation for "webcam_permissions.allow_access"
    When I click on primary_button ()
  }
end

When(/^I try to upload my selfie$/) do
  steps %Q{
    Then page_title should include translation for "capture.face.upload_title"
    When I try to upload one_face
  }
end

When(/^I upload my document and selfie$/) do
  steps %Q{
    When I try to upload passport
    When I try to upload my selfie
  }
end

Then(/^(.*) should include translation for "([^"]*)"$/) do | page_element, key|
  text = i18n.translate(key)
  steps %Q{
    Then #{page_element} () should contain "#{text}"
  }
end

Then(/^I wait until (.*) has "([^"]*)"$/) do | page_element, key |
  text = i18n.translate(key)
  steps %Q{
    Then I wait until #{page_element} () contains "#{text}"
  }
end

When(/^I press esc key$/) do
  @driver.switch_to.active_element.send_keys(:escape)
end

Then(/^I can (confirm|decline) privacy terms$/) do | action |
  next unless PRIVACY_FEATURE_ENABLED
  steps %Q{
    Then page_title should include translation for "privacy.title"
    When I click on #{action}_privacy_terms ()
  }
end
