Given(/^I verify with (passport|identity_card|drivers_license)$/) do |document_type|
  steps %Q{
    Given I navigate to the SDK
    When I click on verify_identity (SDK)
    Then I should see 3 document_select_buttons ()
    When I click on #{document_type} ()
    Then page_title () should contain "Upload front of document"
    And cross_device_header () should contain "Need to use your mobile to take photos?"
  }
end

When(/^I try to upload (\w+)(?:\s*)(pdf)?( and then retry)?$/) do |document, file_type, should_retry|
  action_button = should_retry ? "take_again" : "confirm"
  steps %Q{
    When I upload #{document} #{file_type} on file_upload ()
    Then I should see uploaded_#{file_type}image ()
    And confirmation_text () should contain "Please confirm that you are happy with this photo."
    When I click on #{action_button} ()
  }
end

element = '(\w+(?:|\(.*\)) \(\w*\)(?:| index \d+))'

When(/^I open #{element} in a new tab$/) do |element|
  url = element.text
  @driver.execute_script("window.open()")
  @tab1, @tab2 = @driver.window_handles
  @driver.switch_to.window(@tab2)
  @driver.get url
end

Then(/^master flow should show connected$/) do
  @driver.switch_to.window(@tab1)
  steps %Q{
    Then page_title () should contain "Connected to your mobile"
  }
end
