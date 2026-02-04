const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const config = require('./config');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const messages = [
    { role: "system", content: config.systemPrompt },
]

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques (CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, 'public')));

// Route index - sert la page HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route - thinking
app.post('/api/thinking', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const userMessage = { role: "user", content: text };
    const allMessages = [...messages, userMessage];

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: allMessages,
    });

    const result = JSON.parse(completion.choices[0].message.content);

    /* const result = {
      story: "Once upon a time, in a land far, far away...",
      mark: Math.floor(Math.random() * 100) // Random mark between 0 and 100 for demo purposes
    }; */

    
    res.json({
      story: result.story,
      mark: result.mark,
      status: 'success'
    });
    
  } catch (error) {
    console.error('Error in /api/thinking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
