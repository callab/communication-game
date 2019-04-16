#\ --port 3000 --server puma --env production

require_relative 'service'

run Service.new
