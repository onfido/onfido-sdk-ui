require 'monster'
require 'URI'
require 'cgi'

SDK_URL = ENV['SDK_URL'] or raise "Missing SDK_URL environment variable"
LOCALE = get_locale

def get_locale
  query_string = CGI::parse(URI(SDK_URL).query)
  query_string['locale']
end
