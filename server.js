const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

let feelings = []; // Memory storage (restart hone pe clear)

// ✅ Add new feeling
app.post('/feelings', (req, res) => {
  const { mood, text } = req.body;

  if (!text) return res.status(400).json({ error: "Text required" });

  const newFeeling = {
    id: Date.now(),
    mood,
    text,
    reactions: { like: 0, love: 0, laugh: 0 }
  };

  feelings.push(newFeeling);

  // WhatsApp notification
  client.messages
    .create({
      from: process.env.WHATSAPP_FROM,
      to: `whatsapp:${process.env.WHATSAPP_TO}`,
      body: `💌 New Feeling:\nMood: ${mood}\nMessage: ${text}`
    })
    .then(() => console.log("✅ WhatsApp sent"))
    .catch(err => console.error("❌ WhatsApp Error:", err));

  res.json(newFeeling);
});

// ✅ Get all feelings
app.get('/feelings', (req, res) => {
  res.json(feelings);
});

// ✅ React to a feeling
app.post('/feelings/:id/react', (req, res) => {
  const { type } = req.body;
  const feeling = feelings.find(f => f.id == req.params.id);

  if (!feeling) return res.status(404).json({ error: "Feeling not found" });

  if (feeling.reactions[type] !== undefined) {
    feeling.reactions[type]++;
  }

  res.json(feeling);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
