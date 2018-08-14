require_relative '../utils/index.rb'

class SDK

  def initialize(driver)
    @driver = driver
  end

  def primary_button
    @driver.find_element(:css, '.onfido-sdk-ui-Theme-btn-primary')
  end

  def document_select_buttons
    @driver.find_elements(:css, '.onfido-sdk-ui-DocumentSelector-icon')
  end

  def identity_card
    @driver.find_element(:css, '.onfido-sdk-ui-DocumentSelector-icon-national-identity-card')
  end

  def drivers_license
    @driver.find_element(:css, '.onfido-sdk-ui-DocumentSelector-icon-driving-licence')
  end

  def passport
    @driver.find_element(:css, '.onfido-sdk-ui-DocumentSelector-icon-passport')
  end

  def file_upload
    element = @driver.find_element(:css, '.onfido-sdk-ui-Uploader-dropzone input[type="file"]')
    @driver.execute_script("return arguments[0].setAttribute('style','display: true');", element)
    @driver.execute_script("return arguments[0].value = '';", element) unless element.attribute('value').empty?
    element
  end

  def take_again
    @driver.find_element(:css, '.onfido-sdk-ui-Confirm-actions > button')
  end

  def confirm
    @driver.find_element(:css, '.onfido-sdk-ui-Confirm-actions > .onfido-sdk-ui-Theme-btn-primary')
  end

  def confirm_privacy_terms
    @driver.find_element(:css, '.onfido-sdk-ui-PrivacyStatement-primary')
  end

  def decline_privacy_terms
    @driver.find_element(:css, '.onfido-sdk-ui-PrivacyStatement-decline')
  end

  def page_title
    @driver.find_element(:css, '.onfido-sdk-ui-Title-title')
  end

  def sub_title
    @driver.find_element(:css, '.onfido-sdk-ui-Title-title + div')
  end

  def uploaded_image
    @driver.find_element(:css, '.onfido-sdk-ui-Confirm-image')
  end

  def uploaded_pdfimage
    if ENV['BROWSER'] && ENV['BROWSER'].downcase == 'chrome' && @driver.browser == :chrome
      @driver.find_element(:css, '.pdfobject')
    else
      # we currently don't support pdf preview in Firefox, Safari, IE, Microsoft Edge, mobile browsers and chrome headless
      @driver.find_element(:css, '.onfido-sdk-ui-Confirm-pdfIcon')
    end
  end

  def complete_text
    @driver.find_element(:css, '.onfido-sdk-ui-Theme-step > div > .onfido-sdk-ui-Complete-wrapper > h1')
  end

  def upload_error_message
    @driver.find_element(:css, '.onfido-sdk-ui-Uploader-error')
  end

  def error_message
    @driver.find_element(:css, '.onfido-sdk-ui-Error-title-text')
  end

  def error_instruction
    @driver.find_element(:css, '.onfido-sdk-ui-Error-instruction')
  end

  def back
    @driver.find_element(:css, '.onfido-sdk-ui-NavigationBar-back')
  end

  def cross_device_button
    @driver.find_element(:css, '.onfido-sdk-ui-SwitchDevice-container')
  end

  def cross_device_header
    @driver.find_element(:css, '.onfido-sdk-ui-SwitchDevice-header')
  end

  def cross_device_link
    @driver.find_element(:css, '.onfido-sdk-ui-CrossDeviceLink-linkText')
  end

  def modal_button
    @driver.find_element(:id, 'button')
  end
end

def open_sdk(driver, config)
  sdk_url = SDK_URL
  config.each do |key, value|
    sdk_url = add_query_to_url(sdk_url, key, value)
  end
  driver.manage.timeouts.page_load = 30 # ref: https://stackoverflow.com/a/11377772
  driver.manage.timeouts.implicit_wait = 10 # ref: https://stackoverflow.com/a/11354143
  driver.get sdk_url
end

Given(/^I navigate to the SDK as a modal/) do
  open_sdk(@driver, { 'useModal' => true, 'useWebcam' => false })
end

Given(/^I navigate to the SDK(?:| with "([^"]*)"?)$/) do |locale_tag|
  open_sdk(@driver, { 'language' => locale_tag, 'useWebcam' => false })
end

Given(/^I navigate to the SDK using a webcam(?:| with "([^"]*)"?)$/) do |locale_tag|
  open_sdk(@driver, { 'useWebcam' => true, 'language' => locale_tag })
end
