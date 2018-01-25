class I18nHelper
  def load_locale(locale)
    tag = locale ? locale : 'en'
<<<<<<< HEAD
    lines = File.readlines(File.expand_path("../locales/#{tag}.js"))
=======
    lines = File.readlines(File.expand_path("../src/locales/#{tag}.js"))
>>>>>>> development
    lines[0] = "{\n"
    @translations = lines.join.to_json
  end

  def translate(key)
    @translations[key]
  end
end
