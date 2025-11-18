const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const messages = req.body.messages || [];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "HTTP-Referer": "https://inps-ia",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3-8b-instruct",
        messages: messages,
        temperature: 0.4
      })
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || "No pude generar respuesta.";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor IA" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor IA funcionando en http://localhost:${PORT}`);
});
