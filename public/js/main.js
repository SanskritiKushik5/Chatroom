const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Join chatroom
socket.emit('joinRoom', { username, room })

// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}