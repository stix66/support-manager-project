const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files (e.g., chatbot.js)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Webhook route
app.post('/webhook', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Please type a message to get started!" });
    }

    try {
        const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: "You are Larry's witty and helpful Support Manager. Respond with humor and provide assistance."
                },
                { role: 'user', content: userMessage },
            ],
            max_tokens: 300,
            temperature: 0.85,
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
        });

        const reply = gptResponse.data.choices[0].message.content;
        res.status(200).json({ reply });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ reply: "Something went wrong. Try again later!" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
