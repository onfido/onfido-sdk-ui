require 'fileutils'
require 'yaml'
require_relative '../utils/index.rb'

LOCALES = ['en', 'es'] # List of supported locales

class I18nHelper
  def initialize(driver)
    @driver = driver
  end

  def load_locale(locale)
    tag = locale ? locale : 'en'
    path_to_file = File.join(Dir.pwd, 'locales', "#{tag}.yml")
    @translations = YAML.load_file(path_to_file)
  end

  def translate(key)
    @translations[key]
  end

  def set_locales
    LOCALES.each do | locale |
      @driver.get add_query_to_url(SDK_URL, 'locale', locale)
      # when `?async=false` we need to wait until the script is exectued
      phrases = ''
      wait_until(30) {
        # Fn module is not working. In order to access the translations files
        # within the test suite I had to make them available within the window
        phrases = @driver.execute_script('return window.testLocale;')
      }
      write_locale(phrases, locale)
    end
  end

  def write_locale(phrases, locale)
    FileUtils.mkdir_p('locales') unless Dir.exists?('locales')
    filepath = File.join(Dir.pwd, 'locales', "#{locale}.yml")
    f = File.open(filepath,"w+")
    f.write(phrases.to_yaml)
    f.close
  end
end
