const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Webhook Verification for Messenger
app.get('/webhook', (req, res) => {
    const VERIFY_TOKEN = process.env.SECRET_TOKEN || 'my_secure_token';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
        if (mode === 'subscribe') {
            console.log('Webhook verified.');
            return res.status(200).send(challenge);
        }
    } else {
        res.sendStatus(403);
    }
});

// Handle POST requests from Messenger and Website
app.post('/webhook', (req, res) => {
    const body = req.body;

    // Messenger Events
    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhookEvent = entry.messaging[0];
            const senderId = webhookEvent.sender.id;

            if (webhookEvent.message) {
                const userMessage = webhookEvent.message.text;
                sendMessageToMessenger(senderId, `You said: "${userMessage}"`);
            }
        });
        return res.status(200).send('EVENT_RECEIVED');
    }

    // Website Events
    if (body.message) {
        const userMessage = body.message;
        const botReply = `You said: "${userMessage}". How can I assist you?`;
        return res.status(200).json({ reply: botReply });
    }

    // Fallback for unmatched requests
    res.sendStatus(404);
});

// Send Messages to Messenger
const sendMessageToMessenger = (senderId, text) => {
    const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
    const requestBody = {
        recipient: { id: senderId },
        message: { text },
    };

    axios
        .post(`https://graph.facebook.com/v12.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody)
        .then(response => console.log('Message sent to Messenger:', response.data))
        .catch(error => console.error('Error sending message to Messenger:', error.message));
};

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
