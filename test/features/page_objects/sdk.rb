require_relative '../utils/index.rb'

class SDK

  def initialize(driver)
    @driver = driver
  end

  def primary_button
    @driver.find_element(:css, '.onfido-sdk-ui-Button-button-primary')
  end

  def document_select_buttons
    @driver.find_elements(:css, '.onfido-sdk-ui-DocumentSelector-icon')
  end

  def identity_card
    @driver.find_element(:css, '.onfido-sdk-ui-DocumentSelector-icon-national-identity-card')
  end

  def passport
    @driver.find_element(:css, '.onfido-sdk-ui-DocumentSelector-icon-passport')
  end

  def file_upload
    element = @driver.find_element(:css, '.onfido-sdk-ui-Uploader-uploadArea input[type="file"]')
    @driver.execute_script("return arguments[0].setAttribute('style','display: true');", element)
    @driver.execute_script("return arguments[0].value = '';", element) unless element.attribute('value').empty?
    element
  end

  def confirm
    @driver.find_element(:css, '.onfido-sdk-ui-Confirm-actions > .onfido-sdk-ui-Button-button-primary')
  end

  def page_title
    @driver.find_element(:css, '.onfido-sdk-ui-PageTitle-title')
  end

  def sub_title
    @driver.find_element(:css, '.onfido-sdk-ui-PageTitle-title + div')
  end

  def back
    @driver.find_element(:css, '.onfido-sdk-ui-NavigationBar-back')
  end

  def modal_button
    @driver.find_element(:id, 'button')
  end
end

def open_sdk(driver, config)
  puts "Open SDK"
  sdk_url = SDK_URL
  config.each do |key, value|
    sdk_url = add_query_to_url(sdk_url, key, value)
  end
  driver.manage.timeouts.page_load = 120 # ref: https://stackoverflow.com/a/11377772
  driver.manage.timeouts.implicit_wait = 30 # ref: https://stackoverflow.com/a/11354143
  driver.get sdk_url
end
