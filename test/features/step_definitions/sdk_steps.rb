Given(/^I verify with (passport|identity_card|drivers_license)$/) do |document_type|
  steps %Q{
    Given I navigate to the SDK
    When I click on primary_button (SDK)
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

Then(/^I should reach the complete step$/) do
  steps %Q{
    Then complete_text () should contain "Verification complete"
    Then I should not see "back"
  }
end

Then(/^I can navigate back to the previous page with title "([^"]*)"$/) do | title |
  steps %Q{
    When I click on back ()
    Then page_title () should contain "#{title}"
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

When(/^I switch to tab (\d+)$/) do |number|
  tab = self.instance_variable_get("@tab#{number}")
  @driver.switch_to.window(tab)
end

When(/^I upload my document and selfie$/) do
  steps %Q{
    When I try to upload passport
    Then page_title () should contain "Upload a selfie"
    When I try to upload one_face
  }
end
