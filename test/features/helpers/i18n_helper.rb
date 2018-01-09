class I18nHelper
  def load_locale(locale)
    tag = locale ? locale : 'en'
    lines = File.readlines(File.expand_path("../locales/#{tag}.js"))
    lines[0] = "{\n"
    @translations = eval(lines.join)
  end

  def translate(key)
    @translations[key]
  end
end
