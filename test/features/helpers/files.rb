def get_asset(filename, pdf = false)
  entries = Dir.entries('./features/helpers/resources')
  file_name = entries
    .select {|f|
      pdf ?
      f.end_with?('.pdf') :
      !f.end_with?('.pdf')
    }
    .detect {|f| f.include? filename}
  return "#{Dir.pwd}/features/helpers/resources/#{file_name}"
end
