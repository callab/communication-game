var connect = function() {
  console.log("Setting up socket...");

  var socket = new WebSocket("ws://localhost:3000");

  socket.onopen = function(ev) {
    console.log("Connection established.");
    setMessage('Connected. Finding another player...');
  };

  socket.onmessage = function(ev) {
    console.log('Data received:');
    console.log(ev.data);

    var message = ev.data.trim();

    if (message.length > 0) {
      try {
        var state = JSON.parse(message);
      }
      catch (e) {
        return;
      }

      updateGame(state);
    }
  };

  socket.onclose = function(ev) {
    console.log('Disconnected.');
    setMessage('Disconnected.');
  };
};

var setMessage = window.setMessage = function(message) {
  var el = document.querySelector('.message');
  el.textContent = message;
}

var send = window.send = function(message) {
  console.log("Sending data:");
  console.log(message);
  socket.send(message);
};

var tdIndex = function(td) {
  var col = td.cellIndex;
  var row = td.parentElement.rowIndex;
  return { row: row, col: col };
};

var updateGame = function(state) {
  var table = document.querySelector('table');
  table.classList.remove('hidden');

  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var playerId = state.board[row][col];
      var td = table.rows[row].cells[col];

      td.classList.remove('mine');
      td.classList.remove('theirs');

      if (playerId == state.player_id) {
        td.classList.add('mine');
      }
      else if (playerId > 0) {
        td.classList.add('theirs');
      }
    }
  }

  if (state.is_current) {
    setMessage('It is your turn. Pick a tile to scan.');
  }
  else {
    setMessage('Waiting for the other player to scan a tile...');
  }
};

var cells = document.querySelectorAll('td');
cells.forEach(function(cell) {
  cell.addEventListener('click', function(ev) {
    send(JSON.stringify(tdIndex(ev.target)));
  });
});

if (document.querySelector('table.board')) {
  connect();
};
