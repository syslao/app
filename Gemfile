source 'https://rubygems.org'

# ruby
ruby '2.1.6'

# rails
gem 'rails', '4.1.15'

# database
gem 'mysql2', '~> 0.3.21' # 0.3.x is for rails 4.x
gem "redis-rails"

# asset pipeline
gem 'sass-rails', '~> 4.0.5' # because of the ancient active_admin
gem 'uglifier'
gem 'coffee-rails'
gem 'jquery-rails'

# gems we need
gem 'pageflow'
gem 'activeadmin', git: 'https://github.com/codevise/active_admin.git', branch: 'rails4'
gem 'ransack'
gem 'inherited_resources', '1.4.1'
gem 'formtastic', '2.3.0'
gem 'state_machine', git: 'https://github.com/codevise/state_machine.git'
gem 'figaro'
gem 'whenever', require: false
gem "sentry-raven"
gem "snitcher"

# Pageflow extensions
gem 'pageflow-internal-links'
gem 'pageflow-external-links'
gem 'pageflow-before-after'
gem 'pageflow-text-page'
gem 'pageflow-embedded-video'
gem 'pageflow-linkmap-page', github: 'scrollytelling/pageflow-linkmap-page', branch: 'scrollytelling-rendered-text'
gem 'scrollytelling-loading_spinner'
gem 'scrollytelling-pageflow-navigation'

group :development do
  gem 'spring'
end

group :test do
  gem 'cucumber-rails', require: false
  gem 'database_cleaner'
end

group :development, :test do
  gem 'rspec-rails'
end
