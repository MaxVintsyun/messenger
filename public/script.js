const messageTemplate = document.querySelector('#message-template').content.querySelector('.message');
const enteredChatTemplate = document.querySelector('#entered-chat').content.querySelector('.chat-screen__update');
(function() {
    const app = document.querySelector('.app');
    const socket = io();

    let uName;

    app.querySelector('.form__join-button').addEventListener('click', () => {
        let userName = app.querySelector('.username__input').value;

        socket.emit('newuser', userName);
        uName = userName;
        app.querySelector('.join-screen').classList.remove('screen_active');
        app.querySelector('.chat-screen').classList.add('screen_active');
    });

    app.querySelector('.typebox__send').addEventListener('click', () => {
        let message = app.querySelector('#message-input').value;
        if(message.length === 0) return;
        renderMessage('my', {
            userName: uName,
            text: message
        });
        socket.emit('chat', {
            userName: uName,
            text: message
        });
        app.querySelector('.typebox__input').value = '';
    });

    app.querySelector('#exit-chat').addEventListener('click', () => {
        socket.emit('exituser', uName);
        window.location.href = window.location.href;
    });

    socket.on('update', (update) => {
        renderMessage('update', update);
    })

    socket.on('chat', (message) => {
        renderMessage('other', message);
    });

    function renderMessage(type, message) {
        let messageContainer = document.querySelector('.chat-screen__messages');
        let messageElement = messageTemplate.cloneNode(true);
        let messagePerson = messageElement.querySelector('.user-message__name');
        let messageText = messageElement.querySelector('.user-message__text');
        let enteredChatElement = enteredChatTemplate.cloneNode(true);
        if(type === 'my') {
            messageElement.classList.add('your-message');
            messagePerson.textContent = 'Вы';
            messageText.textContent = message.text;
            messageContainer.append(messageElement);
        } else if (type === 'other') {
            messageElement.classList.add('other-message');
            messagePerson.textContent = message.userName;
            messageText.textContent = message.text;
            messageContainer.append(messageElement);            
        } else if (type === 'update') {
            enteredChatElement.textContent = message;
            messageContainer.append(enteredChatElement);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
})();