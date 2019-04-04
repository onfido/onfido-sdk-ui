require_relative '../helpers/i18n_helper.rb'

i18n = I18nHelper.new

Given(/^I navigate to the SDK with PoA feature enabled$/) do
  open_sdk(@driver, { 'poa' => true, 'useWebcam' => false })
end


When(/^I upload (\w+)(?:\s*)(pdf)?( and then retry)?$/) do |document, file_type, should_retry|
  action_button = should_retry ? "take_again" : "confirm"

  steps %Q{
    When I upload #{document} #{file_type} on file_upload ()
    Then I should see uploaded_#{file_type}image ()
  }
end
