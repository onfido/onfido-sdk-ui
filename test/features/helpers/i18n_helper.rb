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
    @driver.manage.timeouts.page_load = 30 # ref: https://stackoverflow.com/a/11377772
    @driver.manage.timeouts.implicit_wait = 10 # ref: https://stackoverflow.com/a/11354143
    @driver.get SDK_URL
    writeLocale
  end

  def writeLocale
    locale = @driver.execute_script('return window.testLocale;')
    FileUtils.mkdir_p('locales') unless Dir.exists?('locales')
    filepath = File.join(Dir.pwd, 'locales', 'locale.yml')
    f = File.open(filepath,"w+")
    f.write(locale.to_yaml)
    f.close
  end
end
