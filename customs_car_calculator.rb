require 'sinatra/base'
require 'sinatra/asset_pipeline'
require 'net/http'
require 'nokogiri'
require 'i18n'
require 'pry'

class CustomsCarCalculator < Sinatra::Base
  register Sinatra::AssetPipeline

  set :assets_precompile, %w[application.css application.js favicon.ico]

  configure do
    %w[stylesheets javascripts images].each do |assets_dir|
      sprockets.append_path File.join(root, 'assets', assets_dir)
    end
    sprockets.append_path File.join(root, 'vendor', 'assets', 'bootstrap5')
  end

  set :views, settings.root + '/templates'

  I18n.load_path << settings.root + "/config/locales" + "/en.yml"
  I18n.load_path << settings.root + "/config/locales" + "/ru.yml"
  I18n.load_path << settings.root + "/config/locales" + "/ua.yml"
  I18n.default_locale = :ua # (note that `en` is already the default!)

  get '/', provides: 'html' do
    # I18n.default_locale
    @usd_rate = CurrencyService.call
    slim :index

  end

  get '/:locale', provides: 'html' do
    if I18n.available_locales.include?(params[:locale].to_sym)
      I18n.locale = params[:locale].to_sym
    else
      I18n.locale = I18n.default_locale
    end

    @usd_rate = CurrencyService.call
    slim :index
  end

#  get '/ua', provides: 'html' do
#    I18n.locale = :ua
#    @usd_rate = CurrencyService.call
#    slim :index
#  end

#  get '/ru', provides: 'html' do
#    I18n.locale = :ru
#    @usd_rate = CurrencyService.call
#    slim :index
#  end

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
