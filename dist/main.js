console.log("Setting up socket...");

var socket = new WebSocket("ws://localhost:3000")

socket.onopen = function(ev) {
  console.log("Connection established.");
};

socket.onmessage = function(ev) {
  console.log(ev.data);
};

window.send = function(message) {
  socket.send(message);
};
