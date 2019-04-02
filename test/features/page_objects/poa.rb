require_relative '../utils/index.rb'

class POA

  def initialize(driver)
    @driver = driver
  end

  def verify_uk_address_title
    @driver.find_element(:xpath, "//span[contains(.,'Let’s verify your UK address')]")
  end

  def need_a_doc_text
    @driver.find_element(:xpath, "//p[contains(.,'You’ll need a document that:')]")
  end

  def bullet_1
    @driver.find_element(:xpath, "//span[contains(.,'Shows your current address')]")
  end

  def bullet_2
    @driver.find_element(:xpath, "//span[contains(.,'Matches the address you used on signup')]")
  end

  def bullet_3
    @driver.find_element(:xpath, "//span[contains(.,'Is your most recent document')]")
  end

  def start_verification_button
    @driver.find_element(:xpath, "//button[contains(.,'Start verification')]")
  end

  def document_selection_screen_title
    @driver.find_element(:xpath, "//span[@class='onfido-sdk-ui-Title-titleSpan'][contains(.,'Select a UK document')]")
  end

end
