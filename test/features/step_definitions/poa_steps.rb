require_relative '../helpers/i18n_helper.rb'

i18n = I18nHelper.new

Given(/^I navigate to the SDK with PoA feature enabled$/) do
  open_sdk(@driver, { 'poa' => true, 'useWebcam' => false })
end
