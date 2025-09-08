const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const twilio = require('twilio');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio setup
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// In-memory storage (clears when server restarts)
let feelings = [];

// ✅ Serve frontend (optional if frontend is inside /public)
app.use(express.static(path.join(__dirname, "public")));

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
  const id = Number(req.params.id);
  const feeling = feelings.find(f => f.id === id);

  if (!feeling) return res.status(404).json({ error: "Feeling not found" });

  if (feeling.reactions[type] !== undefined) {
    feeling.reactions[type]++;
  }

  res.json(feeling);
});

// ✅ Delete a feeling
app.delete('/feelings/:id', (req, res) => {
  const id = Number(req.params.id);
  console.log("🗑 Delete request for ID:", id);

  const index = feelings.findIndex(f => f.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Feeling not found" });
  }

  const deletedFeeling = feelings.splice(index, 1);
  res.json({ message: "Feeling deleted", feeling: deletedFeeling });
});

// ✅ Fallback route
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Dynamic PORT (Render/Heroku)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
