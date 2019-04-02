require_relative '../utils/index.rb'

class POA

  def initialize(driver)
    @driver = driver
  end

  def verify_uk_address_title
    @driver.find_element(:xpath, "//span[contains(.,'Let’s verify your UK address')]")
  end

end
