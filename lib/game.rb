require 'json'
require_relative 'board'

class Game
  def initialize(player_one, player_two)
    @player_one = player_one
    @player_two = player_two
    @current_player = player_one
    @board = Board.new(4, 4)

    @player_one.socket.on(:message) do |event|
      handle_input(@player_one, event)
    end

    @player_two.socket.on(:message) do |event|
      handle_input(@player_two, event)
    end
  end

  def start
    begin_round
  end

  def begin_round
    @player_one.send(JSON.generate(as_json(@player_one)))
    @player_two.send(JSON.generate(as_json(@player_two)))
  end

  def handle_input(player, event)
    message = event.data
    if player == @current_player
      move = JSON.parse(message)
      x = move['row']
      y = move['col']
      @board.scan(x.to_i, y.to_i, @current_player.id)
      puts @board.draw
      puts
      swap_players
      begin_round
    end
  end

  def swap_players
    if @current_player == @player_one
      @current_player = @player_two
    else
      @current_player = @player_one
    end
  end

  def as_json(player)
    is_current = @current_player == player

    {
      is_current: is_current,
      player_id: player.id,
      board: @board.as_json
    }
  end
end
