require 'sinatra/base'
require 'sinatra/asset_pipeline'
require 'net/http'
require 'nokogiri'

class CustomsCarCalculator < Sinatra::Base
  register Sinatra::AssetPipeline

  set :assets_precompile, %w[application.css application.js]

  configure do
    %w[stylesheets javascripts images].each do |assets_dir|
      sprockets.append_path File.join(root, 'assets', assets_dir)
    end
    sprockets.append_path File.join(root, 'vendor', 'assets', 'bootstrap5')
  end

  set :views, settings.root + '/templates'

  get '/', provides: 'html' do
    @usd_rate = CurrencyService.call
    slim :index
  end
  
  run! if app_file == $0
end

class CurrencyService
  def self.call
    filepath = CustomsCarCalculator.settings.root + '/tmp/' + 'rate-' + DateTime.now.strftime('%F')

    if File.exist? filepath
      File.read(filepath).to_f
    else
      doc = URI('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml')
              .then { |uri| Net::HTTP.get(uri) }
              .then { |res| Nokogiri::XML(res) }

      rate = doc.at_xpath('//gesmes:Envelope').search('Cube[currency="USD"]').first['rate'].to_f

      File.open(filepath, "w") { |f| f.write rate }

      rate
    end
  end
end
