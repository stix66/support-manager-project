const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON
app.use(bodyParser.json());

// Webhook route
app.post('/webhook', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ reply: "Oops! Looks like you forgot to type something. Give it another shot!" });
    }

    try {
        // Send user message to OpenAI GPT API
        const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: "You are Larry's Support Manager, a witty and helpful assistant. Provide entertaining, humorous, and helpful responses while solving technical issues."
                },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 300,
            temperature: 0.85
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Securely access environment variable
                'Content-Type': 'application/json'
            }
        });

        const botReply = gptResponse.data.choices[0].message.content;

        // Respond to the user
        res.status(200).json({ reply: botReply });
    } catch (error) {
        console.error('Error communicating with GPT API:', error.message);
        res.status(500).json({ reply: "Uh-oh, something went wrong on my end. Can you try again?" });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
