require_relative '../helpers/i18n_helper.rb'

Before do
  # Only run this once
  locale_set ||= false
  return if locale_set
  I18nHelper.new(@driver).setLocale
  locale_set = true
end
