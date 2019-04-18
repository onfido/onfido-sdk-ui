require_relative '../utils/index.rb'

class POA

  def initialize(driver)
    @driver = driver
  end

  def file_upload
    element = @driver.find_element(:css, '.onfido-sdk-ui-Uploader-uploadArea input[type="file"]')
    @driver.execute_script("return arguments[0].setAttribute('style','display: true');", element)
    @driver.execute_script("return arguments[0].value = '';", element) unless element.attribute('value').empty?
    element
  end

  def uploaded_image
    @driver.find_element(:css, '.onfido-sdk-ui-Confirm-CaptureViewer-image')
  end

  def verify_uk_address_title
    @driver.find_element(:xpath, "//span[contains(.,'Let’s verify your UK address')]")
  end

  def need_a_doc_text
    @driver.find_element(:xpath, "//p[contains(.,'You’ll need a document that:')]")
  end

  def poa_requirements
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

  def poc_document_cell(cell)
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-option'][contains(.,'#{cell}')]")
  end

  def bank_building_statement_cell
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-option'][contains(.,'Bank/Building Society Statemente-statements accepted')]")
  end

  def utility_bill_cell
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-option'][contains(.,'Utility Bill')]")
  end

  def benefits_letter_cell
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-option'][contains(.,'Benefits Letter')]")
  end

  def council_tax_letter_cell
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-option'][contains(.,'Council Tax Letter')]")
  end

  def poc_document_icon(doc)
    @driver.find_element(:xpath, "//div[contains(@class,'onfido-sdk-ui-DocumentSelector-icon onfido-sdk-ui-DocumentSelector-icon-#{doc}')]")
  end

  def council_tax_letter_icon()
    @driver.find_element(:xpath, "(//div[contains(@class,'onfido-sdk-ui-DocumentSelector-icon onfido-sdk-ui-DocumentSelector-icon-letter')])[1]")
  end

  def benefits_letter_icon
    @driver.find_element(:xpath, "(//div[contains(@class,'onfido-sdk-ui-DocumentSelector-icon onfido-sdk-ui-DocumentSelector-icon-letter')])[2]")
  end

  def poc_document_cell_title(title)
    @driver.find_element(:xpath, "//p[@class='onfido-sdk-ui-DocumentSelector-label'][contains(.,'#{title}')]")
  end

  def bank_building_statement_subtitle
    @driver.find_element(:xpath, "(//div[@class='onfido-sdk-ui-DocumentSelector-tag'][contains(.,'e-statements accepted')])[1]")
  end

  def utility_bill_subtitle
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-hint'][contains(.,'Gas, electricity, water, landline, or broadband')]")
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-warning'][contains(.,'Sorry, no mobile phone bills')]")
    @driver.find_element(:xpath, "(//div[@class='onfido-sdk-ui-DocumentSelector-tag'][contains(.,'e-statements accepted')])[2]")
  end

  def benefits_letter_subtitle
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-DocumentSelector-hint'][contains(.,'Government authorised household benefits eg. Jobseeker allowance, Housing benefit, Tax credits')]")
  end

  ### Document upload intro screen elements
  def document_upload_intro_screen(title)
    @driver.find_element(:xpath, "//span[@class='onfido-sdk-ui-Title-titleSpan'][contains(.,'#{title}')]")
  end

  def document_issued_last_months_text(months_message)
    @driver.find_element(:xpath, "//span[@class='onfido-sdk-ui-ProofOfAddress-Guidance-subTitle'][contains(.,'#{months_message}')]")
  end

  def make_sure_clear_text(clear_text_message)
    @driver.find_element(:xpath, "//div[@class='onfido-sdk-ui-ProofOfAddress-Guidance-makeSure'][contains(.,'#{clear_text_message}')]")
  end

  def document_fields_points_list_text
    @driver.find_element(:xpath, "//*[contains(text(), 'Logo')]")
    @driver.find_element(:xpath, "//*[contains(text(), 'Full name')]")
    @driver.find_element(:xpath, "//*[contains(text(), 'Current')]")
    @driver.find_element(:xpath, "//*[contains(text(), 'Address')]")
    @driver.find_element(:xpath, "//*[contains(text(), 'Issue date or')]")
    @driver.find_element(:xpath, "//*[contains(text(), 'Summary period')]")
  end

  def continue_button
    @driver.find_element(:xpath, "//button[contains(.,'Continue')]")
  end

  def poa_upload_confirmation_title
    @driver.find_element(:xpath, "//span[@class='onfido-sdk-ui-Title-titleSpan'][contains(.,'Check readability')]")
  end

  def poa_upload_confirmation_subtitle
    @driver.find_element(:xpath, "(//div[contains(.,'Make sure details are clear to read, with no blur or glare')])[9]")
  end
end
