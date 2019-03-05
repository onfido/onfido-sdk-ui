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

def start_browserstack_local
  bs_local = BrowserStack::Local.new
  bs_local_args = {
    "key" => ENV['BROWSERSTACK_ACCESS_KEY'],
    "localIdentifier" => ENV["BROWSERSTACK_LOCAL_IDENTIFIER"],
    "force" => ""
  }

  puts "Starting BrowserStack Local"
  puts bs_local.start(bs_local_args)
end

@browsers = JSON.load(open('browsers.json'))


def create_driver
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

  url = "http://#{ENV['BS_USERNAME']}:#{ENV['BROWSERSTACK_ACCESS_KEY']}@hub-cloud.browserstack.com/wd/hub"

  driver = Selenium::WebDriver.for(:remote, :url => url, :desired_capabilities => capabilities)

  # Supports uploading file to a remove runner
  # ref: https://saucelabs.com/blog/selenium-tips-uploading-files-in-remote-webdriver
  driver.file_detector = lambda do |args|
     # args => ["/path/to/file"]
     str = args.first.to_s
     str if File.exist?(str)
  end

  return driver
end

Before('@browser') do |scenario|
  # The driver has to be created and browser stack local has to be created everytime
  # This only because Monster is killing both at the end of each scenario
  puts "Before scenario"
  start_browserstack_local()

  puts @driver
  driver = create_driver()
  puts driver
  @driver = driver
end

at_exit do
  # driver.quit
  # bs_local.stop()
end
