require_relative 'lib/game'
require_relative 'lib/player'

class Service
  def start
    p1 = Player.new(1)
    p2 = Player.new(2)
    game = Game.new(p1, p2)
    game.start
  end

  def shutdown
  end
end

service = Service.new

Signal.trap('INT') do
  service.shutdown
  exit
end

Signal.trap('TERM') do
  service.shutdown
  exit
end

service.start
