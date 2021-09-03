require 'sinatra/base'
require 'sinatra/asset_pipeline'

class CustomsCarCalculator < Sinatra::Base
  register Sinatra::AssetPipeline

  set :assets_precompile, %w[application.css]

  configure do
    %w[stylesheets javascripts images].each do |assets_dir|
      sprockets.append_path File.join(root, 'assets', assets_dir)
    end
    sprockets.append_path File.join(root, 'vendor', 'assets', 'bootstrap5')
  end

  set :views, settings.root + '/templates'

  get '/', provides: 'html' do
    slim :index
  end
  
  run! if app_file == $0
end
