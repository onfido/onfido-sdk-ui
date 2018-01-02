require 'fileutils'
require 'yaml'

class I18nHelper
  def initialize(driver)
    @driver = driver
  end

  def self.translate(key)
    path_to_file = File.join(Dir.pwd, 'locales', 'locale.yml')
    translationHash = YAML.load_file(path_to_file)
    translationHash[key]
  end

  def setLocale
    @driver.get SDK_URL
    # when `?async=false` we need to wait until the script is exectued
    locale = ''
    wait_until(30) { locale = @driver.execute_script('return window.testLocale;')}
    writeLocale(locale)
  end

  def writeLocale(locale)
    FileUtils.mkdir_p('locales') unless Dir.exists?('locales')
    filepath = File.join(Dir.pwd, 'locales', 'locale.yml')
    f = File.open(filepath,"w+")
    f.write(locale.to_yaml)
    f.close
  end
end
