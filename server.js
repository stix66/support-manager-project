const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming JSON
app.use(express.json());

// Define the /webhook route
app.post('/webhook', async (req, res) => {
    try {
        console.log('Request body received:', req.body);

        // Make a request to ManyChat's API
        const response = await axios.post(
            'https://api.manychat.com/fb/subscriber/sendContent',
            {
                subscriber_id: req.body.subscriber_id,
                data: req.body.message,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.MANYCHAT_API_KEY}`, // Use the environment variable here
                },
            }
        );

        // Respond with ManyChat's response
        res.status(200).send(response.data);
    } catch (error) {
        console.error('Error communicating with ManyChat:', error.message);
        res.status(500).send({
            success: false,
            error: 'Internal Server Error',
            details: error.message,
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
