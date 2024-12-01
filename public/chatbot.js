// Dynamically create the chatbot interface
function createChatBot() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatBox';
    chatContainer.style.cssText = 'border: 2px solid #007BFF; padding: 15px; border-radius: 10px; max-width: 400px; margin: 20px auto; font-family: Arial, sans-serif; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);';

    const chatTitle = document.createElement('h2');
    chatTitle.style.cssText = 'text-align: center; color: #007BFF;';
    chatTitle.innerText = 'Let’s Get Errrrr Done! 🤖';
    chatContainer.appendChild(chatTitle);

    const userInput = document.createElement('textarea');
    userInput.id = 'userMessage';
    userInput.placeholder = 'Type your question here...';
    userInput.style.cssText = 'width: 100%; height: 60px; margin-top: 10px; padding: 10px; border-radius: 5px; border: 1px solid #ccc;';
    chatContainer.appendChild(userInput);

    const sendButton = document.createElement('button');
    sendButton.id = 'sendMessage';
    sendButton.innerText = 'Send It!';
    sendButton.style.cssText = 'width: 100%; padding: 10px; margin-top: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;';
    chatContainer.appendChild(sendButton);

    const responseBox = document.createElement('div');
    responseBox.id = 'botResponse';
    responseBox.style.cssText = 'margin-top: 15px; padding: 10px; background-color: #e0f7fa; border-radius: 5px;';
    chatContainer.appendChild(responseBox);

    document.body.appendChild(chatContainer);

    // Add functionality to handle user messages
    sendButton.addEventListener('click', async () => {
        const userMessage = userInput.value.trim();
        if (!userMessage) {
            responseBox.innerHTML = '<p>Please type a message before sending.</p>';
            return;
        }

        responseBox.innerHTML = '<p>Thinking... 🤔</p>';

        try {
            const response = await fetch('https://support-manager.onrender.com/webhook', { // Replace with your Render URL
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            responseBox.innerHTML = `<p><strong>Bot:</strong> ${data.reply}</p>`;
        } catch (error) {
            responseBox.innerHTML = '<p>Error: Unable to connect to the bot.</p>';
            console.error('Error:', error);
        }
    });
}

// Initialize the chatbot when the page loads
window.onload = createChatBot;
