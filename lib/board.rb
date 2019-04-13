class Board
  attr_reader :width, :height

  def initialize(width, height)
    @width = width
    @height = height
    @state = Array.new(width) { Array.new(height, 0) }
  end

  def scan(x, y, player_id)
    @state[x][y] = player_id
  end

  # Returns string representation of board state
  def draw
    str = ''

    @state.each do |row|
      str << '|'

      row.each do |val|
        str << val.to_s
        str << '|'
      end

      str << "\n"
    end

    str
  end
end
