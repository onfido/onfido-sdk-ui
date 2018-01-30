class I18nHelper
  def load_locale(locale)
    tag = locale ? locale : 'en'
    lines = File.readlines(File.expand_path("../src/locales/#{tag}.js"))
    lines[0] = "{\n"
    @translations = lines.join.to_json
  end

  def translate(key)
    @translations[key]
  end
end
