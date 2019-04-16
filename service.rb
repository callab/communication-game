require 'faye/websocket'
require_relative 'lib/game'
require_relative 'lib/player'

# Be careful! Instance shared by all puma threads.
class Service
  def initialize
    @clients = []
  end

  def call(env)
    if Faye::WebSocket.websocket?(env)
      puts 'Creating socket connection.'

      ws = Faye::WebSocket.new(env)

      ws.on :open do
        puts 'WS connection open.'
        ws.send('Waiting for another player...')
        @clients << ws

        if @clients.length >= 2
          launch_game
        end
      end

      ws.on :close do |event|
        p [:close, event.code, event.reason]
        # err, remove from list of waiting clients
      end

      ws.rack_response
    else
      [200, { 'Content-Type' => 'text/plain' }, ['Normal HTTP request.']]
    end
  end

  def launch_game
    socket1 = @clients.shift
    socket2 = @clients.shift
    p1 = Player.new(1, socket1)
    p2 = Player.new(2, socket2)
    game = Game.new(p1, p2)
    game.start
  end
end
