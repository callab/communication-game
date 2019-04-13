require_relative 'board'

class Game
  def initialize(player_one, player_two)
    @player_one = player_one
    @player_two = player_two
    @current_player = player_one
    @board = Board.new(4, 4)
  end

  def start
    puts @board.draw
    puts

    while true
      puts "Player #{@current_player.id}, it is your turn."
      puts "Enter coordinates to scan as x, y:"

      input = gets.chomp
      x, y = input.split(',')

      @board.scan(x.to_i, y.to_i, @current_player.id)
      puts @board.draw
      puts
      swap_players
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
