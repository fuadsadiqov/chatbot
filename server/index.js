const express = require('express');
const CryptoJS = require('crypto-js');
require('dotenv').config();
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, 
});

app.post('/message', async (req, res) => {
  const { message } = req.body;
  const encryptedMessage = CryptoJS.AES.encrypt(message, process.env.SECRET_KEY).toString();
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const encryptedResponse = CryptoJS.AES.encrypt(response.data.choices[0].message.content, process.env.SECRET_KEY).toString();
    res.json({ message: encryptedResponse });
  } catch (error) {
    res.status(500).send('Error processing your request');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));