class I18nHelper
  def load_locale(locale)
    tag = locale ? locale : 'en'
    @translations = JSON.parse(File.read(File.expand_path("../src/locales/#{tag}.json")))
  end

  def translate(key)
    @translations.dig(*key.split(".")) or key
  end
end
