class Player
  attr_reader :id, :socket

  def initialize(id, socket)
    @id = id
    @socket = socket
  end

  def send(message)
    @socket.send(message)
  end

  def kick
    @socket.send('Your connection has been closed.')
    @socket.close
  end
end
