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
    send_players @board.draw

    @current_player.send "Player #{@current_player.id}, it is your turn."
    @current_player.send "Enter coordinates to scan as x, y:"
  end

  def send_players(message)
    @player_one.send(message)
    @player_two.send(message)
  end

  def handle_input(player, event)
    message = event.data
    if player == @current_player
      x, y = event.data.split(',')
      @board.scan(x.to_i, y.to_i, @current_player.id)
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
end
