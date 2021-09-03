require 'sinatra/base'
require 'sinatra/asset_pipeline'

class CustomsCarCalculator < Sinatra::Base
  register Sinatra::AssetPipeline
  set :assets_paths, %w(assets)

  set :assets_precompile, %w(application.css)
  configure do
    # Setup Sprockets
    sprockets.append_path File.join(root, 'assets', 'stylesheets')
    sprockets.append_path File.join(root, 'assets', 'javascripts')
    sprockets.append_path File.join(root, 'assets', 'images')
    sprockets.append_path File.join(root, 'vendor', 'assets', 'bootstrap5')
  end

  set :views, settings.root + '/templates'

  get '/', provides: 'html' do
    slim :index
  end
  
  run! if app_file == $0
end

