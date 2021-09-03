require 'sinatra/base'

class CustomsCarCalculator < Sinatra::Base
  set :views, settings.root + '/templates'

  get '/', provides: 'html' do
    slim :index
  end
  
  run! if app_file == $0
end

