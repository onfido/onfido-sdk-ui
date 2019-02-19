require 'monster'
require 'selenium/webdriver'
require 'browserstack-automate'
require 'rubygems'
require 'cucumber'
require 'parallel'
require 'json'
BrowserStack.for "cucumber"

SDK_URL = ENV['SDK_URL'] or raise "Missing SDK_URL environment variable"
PRIVACY_FEATURE_ENABLED = false

@browsers = JSON.load(open('browsers.json'))
@parallel_limit = ENV["nodes"] || 1
@parallel_limit = @parallel_limit.to_i

@capabilities = Selenium::WebDriver::Remote::Capabilities.new

url = "http://#{ENV['BS_USERNAME']}:#{ENV['BS_AUTHKEY']}@hub-cloud.browserstack.com/wd/hub"

capabilities = Selenium::WebDriver::Remote::Capabilities.new
capabilities['os'] = ENV['BS_AUTOMATE_OS']
capabilities['os_version'] = ENV['BS_AUTOMATE_OS_VERSION']
capabilities['browser'] = ENV['SELENIUM_BROWSER']
capabilities['browser_version'] = ENV['SELENIUM_VERSION']
capabilities['browserstack.debug'] = "true"

capabilities['project'] = ENV['BS_AUTOMATE_PROJECT'] if ENV['BS_AUTOMATE_PROJECT']
capabilities['build'] = ENV['BS_AUTOMATE_BUILD'] if ENV['BS_AUTOMATE_BUILD']

driver = Selenium::WebDriver.for(:remote, :url => url,
                                  :desired_capabilities => capabilities)

Before do |scenario|
  @driver = driver
end

at_exit do
  driver.quit
end
