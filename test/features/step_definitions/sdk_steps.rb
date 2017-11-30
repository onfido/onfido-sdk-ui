Given(/^I verify with (passport|identity_card|drivers_license)$/) do |document_type|
  if document_type == 'passport'
    title = 'Passport photo page'
  elsif document_type == 'identity_card'
    title = 'Front of card'
  elsif document_type == 'drivers_license'
    title = 'Front of license'
  end

  steps %Q{
    Given I navigate to the SDK
    When I click on primary_button (SDK)
    Then I should see 3 document_select_buttons ()
    When I click on #{document_type} ()
    Then page_title () should contain "#{title}"
    And cross_device_header () should contain "Need to use your mobile to take photos?"
  }
end

When(/^I try to upload (\w+)(?:\s*)(pdf)?( and then retry)?$/) do |document, file_type, should_retry|
  action_button = should_retry ? "take_again" : "confirm"
  if document.include?('passport') || document.include?('llama')
    short_doc = 'passport'
  elsif document.include? 'identity_card'
    short_doc = 'card'
  elsif document.include?('license') || document.include?('licence')
    short_doc = 'license'
  end

  confirm_text = short_doc ?
    "Make sure your #{short_doc} details are clear to read, with no blur or glare" :
    "Make sure your selfie clearly shows your face"

  steps %Q{
    When I upload #{document} #{file_type} on file_upload ()
    Then I should see uploaded_#{file_type}image ()
    And sub_title () should contain "#{confirm_text}"
    When I click on #{action_button} ()
  }
end

Then(/^I should reach the complete step$/) do
  steps %Q{
    Then page_title () should contain "Verification complete"
    Then I should not see "back"
  }
end

Then(/^I can navigate back to the previous page with title "([^"]*)"$/) do | title |
  steps %Q{
    When I click on back ()
    Then page_title () should contain "#{title}"
  }
end

When(/^I upload my document and selfie$/) do
  steps %Q{
    When I try to upload passport
    Then page_title () should contain "Selfie"
    When I try to upload one_face
  }
end
