def add_query_to_url(url, key, value)
  uri = URI.parse(url)
  updated_query_string = URI.decode_www_form(uri.query || '') << [key, value]
  uri.query = URI.encode_www_form(updated_query_string)
  return uri.to_s
end
