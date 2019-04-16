require_relative 'board'

class Game
  def initialize(player_one, player_two)
    @player_one = player_one
    @player_two = player_two
    @current_player = player_one
    @board = Board.new(4, 4)
  end

  def start
    round
  end

  def round
    send_players @board.draw

    @current_player.send "Player #{@current_player.id}, it is your turn."
    @current_player.send "Enter coordinates to scan as x, y:"

    @current_player.socket.on(:message) do |event|
      x, y = event.data.split(',')
      @board.scan(x.to_i, y.to_i, @current_player.id)
      swap_players
      round
    end
  end

  def send_players(message)
    @player_one.send(message)
    @player_two.send(message)
  end

  def swap_players
    if @current_player == @player_one
      @current_player = @player_two
    else
      @current_player = @player_one
    end

    @player_one.socket.on(:message) { }
    @player_two.socket.on(:message) { }
  end
end
