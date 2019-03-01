require 'monster'
require 'selenium/webdriver'
require 'browserstack-automate'
require 'rubygems'
require 'cucumber'
require 'parallel'
require 'json'
require 'browserstack/local'
BrowserStack.for "cucumber"

SDK_URL = ENV['SDK_URL'] or raise "Missing SDK_URL environment variable"
PRIVACY_FEATURE_ENABLED = false

@browsers = JSON.load(open('browsers.json'))
@parallel_limit = ENV["nodes"] || 1
@parallel_limit = @parallel_limit.to_i

capabilities = Selenium::WebDriver::Remote::Capabilities.new

capabilities['os'] = ENV['BS_AUTOMATE_OS']
capabilities['os_version'] = ENV['BS_AUTOMATE_OS_VERSION']
capabilities['browser'] = ENV['SELENIUM_BROWSER']
capabilities['browser_version'] = ENV['SELENIUM_VERSION']
capabilities['browserstack.debug'] = "true"
capabilities['browserstack.local'] = "true"
capabilities['browserstack.localIdentifier'] = ENV['BROWSERSTACK_LOCAL_IDENTIFIER']


capabilities['project'] = "JS SDK"
capabilities['build'] = "PR"
capabilities['name'] = "Compatibility tests"

url = "http://#{ENV['BS_USERNAME']}:#{ENV['BS_AUTHKEY']}@hub-cloud.browserstack.com/wd/hub"

driver = Selenium::WebDriver.for(:remote, :url => url, :desired_capabilities => capabilities)

Before do |scenario|
  @driver = driver
end

at_exit do
  driver.quit
end
