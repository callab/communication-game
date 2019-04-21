var socket;

var connect = function() {
  console.log("Setting up socket...");

  let socket = new WebSocket("ws://localhost:3000/game/socket");

  socket.onopen = function(ev) {
    console.log("Connection established.");
    setMessage('Connected. Finding another player...');
  };

  socket.onmessage = function(ev) {
    console.log('Data received:');
    console.log(ev.data);

    let message = ev.data.trim();

    if (message.length > 0) {
      let state = null;

      try {
        state = JSON.parse(message);
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

  return socket;
};

var setMessage = window.setMessage = function(message) {
  let el = document.querySelector('.message');
  el.textContent = message;
}

var send = window.send = function(message) {
  console.log("Sending data:");
  console.log(message);
  socket.send(message);
};

var tdIndex = function(td) {
  let col = td.cellIndex;
  let row = td.parentElement.rowIndex;
  return { row: row, col: col };
};

var updateGame = function(state) {
  let table = document.querySelector('table');
  table.classList.remove('hidden');

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      let playerId = state.board[row][col];
      let td = table.rows[row].cells[col];

      td.classList.remove('mine');
      td.classList.remove('theirs');

      if (playerId == state.playerId) {
        td.classList.add('mine');
      }
      else if (playerId > 0) {
        td.classList.add('theirs');
      }
    }
  }

  if (state.isCurrent) {
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
  socket = connect();
};
