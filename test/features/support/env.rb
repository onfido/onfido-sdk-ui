require 'monster'
require 'selenium/webdriver'
require 'browserstack/local'

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

  # IE specific

  capabilities['acceptSslCerts'] = "true"
  capabilities['ignoreProtectedModeSettings'] = "true"
  # Syntethic events issue on IE
  # Ref: https://forums.smartclient.com/forum/smart-gwt-technical-q-a/33394-webdriver-ie-click-doesn-t-seem-to-work
  # ref: https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
  capabilities['nativeEvents'] = "true"
  capabilities['requireWindowFocus'] = "true"

  # IE fails when uploading files
  # Some recommend to set fileUploadDialogTimeout,
  # However this doesn't seem to work,
  # and the capability also doesn't seem to be sent
  # ref: https://github.com/seleniumhq/selenium/issues/1604
  #
  # There is an OPEN BUG on this issue
  # https://github.com/seleniumhq/selenium-google-code-issue-archive/issues/3858
  capabilities['ie.fileUploadDialogTimeout'] = "10000"

  puts capabilities.to_json

  # end of IE

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
  puts ENV['BROWSER_STACK']
  if ENV['BROWSER_STACK'] == 'true'
    start_browserstack_local()
    driver = create_driver()
    @driver = driver
  end
end

at_exit do
  # driver.quit
  # bs_local.stop()
end
