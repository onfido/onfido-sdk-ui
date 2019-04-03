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

  def bullet_points
    @driver.find_element(:xpath, "//span[contains(.,'Shows your current address')]")
    @driver.find_element(:xpath, "//span[contains(.,'Matches the address you used on signup')]")
    @driver.find_element(:xpath, "//span[contains(.,'Is your most recent document')]")
  end

  def start_verification_button
    @driver.find_element(:xpath, "//button[contains(.,'Start verification')]")
  end

  ### Document selection screen elements
  def document_selection_screen_title
    @driver.find_element(:xpath, "//span[@class='onfido-sdk-ui-Title-titleSpan'][contains(.,'Select a UK document')]")
  end

  def document_selection_screen_subtitle
    @driver.find_element(:xpath, "(//div[contains(.,'These are the documents most likely to show your current home address')])[9]")
  end

  def bank_building_statement_cell
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-option'][contains(.,'Bank/Building Society Statemente-statements accepted')]")
  end

  def bank_building_statement_icon
    @driver.find_element(:xpath, "//div[contains(@class,'onfido-sdk-ui-DocumentSelector-icon onfido-sdk-ui-DocumentSelector-icon-bank-building-society-statement')]")
  end

  def bank_building_statement_title
    @driver.find_element(:xpath, "//p[@class='onfido-sdk-ui-DocumentSelector-label'][contains(.,'Bank/Building Society Statement')]")
  end

  def bank_building_statement_subtitle
    @driver.find_element(:xpath, "(//div[@class='onfido-sdk-ui-DocumentSelector-tag'][contains(.,'e-statements accepted')])[1]")
  end

  def utility_bill_cell
    @driver.find_element(:xpath, "//p[@class='onfido-sdk-ui-DocumentSelector-label'][contains(.,'Utility Bill')]")
  end

  def utility_bill_icon
    @driver.find_element(:xpath, "//div[contains(@class,'onfido-sdk-ui-DocumentSelector-icon onfido-sdk-ui-DocumentSelector-icon-utility-bill')]")
  end

  def utility_bill_title
    @driver.find_element(:xpath, "//p[@class='onfido-sdk-ui-DocumentSelector-label'][contains(.,'Utility Bill')]")
  end

  def utility_bill_subtitle
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-hint'][contains(.,'Gas, electricity, water, landline, or broadband')]")
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-warning'][contains(.,'Sorry, no mobile phone bills')]")
    @driver.find_element(:xpath, "(//div[@class='onfido-sdk-ui-DocumentSelector-tag'][contains(.,'e-statements accepted')])[2]")
  end

  def council_tax_letter_cell
    @driver.find_element(:xpath, "(//div[contains(@class,'onfido-sdk-ui-DocumentSelector-icon onfido-sdk-ui-DocumentSelector-icon-letter')])[1]")
  end

  def council_tax_letter_icon
    @driver.find_element(:xpath, "(//div[contains(@class,'onfido-sdk-ui-DocumentSelector-icon onfido-sdk-ui-DocumentSelector-icon-letter')])[1]")
  end

  def council_tax_letter_title
    @driver.find_element(:xpath, "//p[@class='onfido-sdk-ui-DocumentSelector-label'][contains(.,'Council Tax Letter')]")
  end

  def benefits_letter_cell
    @driver.find_element(:xpath, "//p[@class='onfido-sdk-ui-DocumentSelector-label'][contains(.,'Benefits Letter')]")
  end

  def benefits_letter_icon
    @driver.find_element(:xpath, "(//div[contains(@class,'onfido-sdk-ui-DocumentSelector-icon onfido-sdk-ui-DocumentSelector-icon-letter')])[2]")
  end

  def benefits_letter_title
    @driver.find_element(:xpath, "//p[@class='onfido-sdk-ui-DocumentSelector-label'][contains(.,'Benefits Letter')]")
  end

  def benefits_letter_subtitle
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-hint'][contains(.,'Government authorised household benefits eg. Jobseeker allowance, Housing benefit, Tax credits')]")
  end

  ### Document upload intro screen elements
  def document_upload_intro_screen_bank_statement_title
    @driver.find_element(:xpath,   "//span[@class='onfido-sdk-ui-Title-titleSpan'][contains(.,'Bank Statement')]")
  end

  def document_upload_intro_screen_utility_bill_title
    @driver.find_element(:xpath,   "//span[@class='onfido-sdk-ui-Title-titleSpan'][contains(.,'Utility Bill')]")
  end

  def document_upload_intro_screen_council_tax_letter_title
    @driver.find_element(:xpath,   "//span[@class='onfido-sdk-ui-Title-titleSpan'][contains(.,'Council Tax Letter')]")
  end

  def document_upload_intro_screen_benefits_letter_title
    @driver.find_element(:xpath,   "//span[@class='onfido-sdk-ui-Title-titleSpan'][contains(.,'Benefits Letter')]")
  end

  def document_issued_last_3_months_text
    @driver.find_element(:xpath,   "//span[@class='onfido-sdk-ui-ProofOfAddress-Guidance-subTitle'][contains(.,'Must be issued in the last 3 months')]")
  end

  def document_issued_last_12_months_text
    @driver.find_element(:xpath,   "//span[@class='onfido-sdk-ui-ProofOfAddress-Guidance-subTitle'][contains(.,'Must be issued in the last 12 months')]")
  end

  def make_sure_clear_text
    @driver.find_element(:xpath,   "//div[@class='onfido-sdk-ui-ProofOfAddress-Guidance-makeSure'][contains(.,'Make sure it clearly shows:')]")
  end

  def document_fields_points_list_text
    @driver.find_element(:xpath,   "//*[contains(text(), 'Logo')]")
    @driver.find_element(:xpath,   "//*[contains(text(), 'Full name')]")
    @driver.find_element(:xpath,   "//*[contains(text(), 'Current')]")
    @driver.find_element(:xpath,   "//*[contains(text(), 'Address')]")
    @driver.find_element(:xpath,   "//*[contains(text(), 'Issue date or')]")
    @driver.find_element(:xpath,   "//*[contains(text(), 'Summary period')]")
  end
end
