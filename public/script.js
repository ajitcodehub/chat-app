const socket = io();
let username = "";
let currentRoom = "General";

function enterChat() {
  const input = document.getElementById("usernameInput");
  username = input.value.trim();
  if (!username) return alert("Please enter a username");

  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("chatScreen").style.display = "block";
  document.getElementById("roomName").innerText = currentRoom;

  socket.emit('joinRoom', { username, room: currentRoom });
}

function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();
  if (!message) return;
  socket.emit('message', { user: username, text: message, room: currentRoom });
  input.value = "";
}

socket.on('message', (data) => {
  displayMessage(data.user, data.text);
});

function displayMessage(user, message) {
  const chatBox = document.getElementById("chatBox");
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.classList.add(user === username ? "you" : "other");

  msgDiv.innerHTML = `<span>${user}</span>${message} <div style="text-align:right; font-size:11px; color:#555;">${time}</div>`;
  chatBox.appendChild(msgDiv);

  // ✅ Always scroll to latest message
  chatBox.scrollTop = chatBox.scrollHeight;
}


function changeRoom() {
  const roomSelect = document.getElementById("roomSelect");
  const newRoom = roomSelect.value;

  if (newRoom !== currentRoom) {
    currentRoom = newRoom;
    document.getElementById("roomName").innerText = currentRoom;
    document.getElementById("chatBox").innerHTML = "";
    socket.emit('joinRoom', { username, room: currentRoom });
  }
}
