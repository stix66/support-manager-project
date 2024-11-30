const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Replace this with your ManyChat API key
const MANYCHAT_API_KEY = 'REMOVED_SECRET';

// Parse incoming JSON
app.use(express.json());

// A sample route for ManyChat webhook
app.post('/webhook', async (req, res) => {
  const data = req.body;
  try {
    const response = await axios.post(
      'https://api.manychat.com/fb/subscriber/sendContent',
      {
        subscriber_id: data.subscriber_id,
        data: data.message,
      },
      {
        headers: {
          Authorization: `Bearer ${MANYCHAT_API_KEY}`,
        },
      }
    );
    res.status(200).send(response.data);
  } catch (error) {
    console.error('Error communicating with ManyChat:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
