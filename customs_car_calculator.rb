require 'sinatra/base'
require 'sinatra/asset_pipeline'
require 'net/http'
require 'nokogiri'
require 'i18n'

class CustomsCarCalculator < Sinatra::Base
  register Sinatra::AssetPipeline

  set :assets_precompile, %w[application.css application.js favicon.ico logo.png]

  configure do
    %w[stylesheets javascripts images].each do |assets_dir|
      sprockets.append_path File.join(root, 'assets', assets_dir)
    end
    sprockets.append_path File.join(root, 'vendor', 'assets', 'bootstrap5')
  end

  %w[ru en ua].each do |language|
    I18n.load_path << settings.root + "/config/locales/#{language}.yml"
  end

  I18n.default_locale = :ua

  set :views, settings.root + '/templates'

  get '/', provides: 'html' do
    set_locale
    set_current_usd_rate
    slim :index, layout: :layout
  end

  get '/:locale/', provides: 'html' do
    set_locale
    set_current_usd_rate
    slim :index, layout: :layout
  end

  get '/:locale', provides: 'html' do
    set_locale
    set_current_usd_rate
    slim :index, layout: :layout
  end

  get '/:locale/about', provides: 'html' do
    set_locale
    slim "about_#{I18n.locale}".to_sym, layout: :layout
  end

  run! if app_file == $0

  private

  def set_current_usd_rate
    @usd_rate = CurrencyService.call
  end

  def set_locale
    if I18n.available_locales.include?(params[:locale]&.to_sym)
      I18n.locale = params[:locale].to_sym
    else
      I18n.locale = I18n.default_locale
    end
  end

  def localized_url(path, locale = I18n.default_locale)
    if path =~ %r{ua|ru|en}
      request.path_info.gsub(%r{ua|ru|en}, locale)
    else
      locale + path
    end

  end
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
