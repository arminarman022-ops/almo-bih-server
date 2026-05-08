require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const GROQ_KEY = process.env.API_KEY;

// PROŠIRENA STATISTIKA
let stats = {
    visits: 148230,
    generated: 5420,
    likes: 89400
};

// RUTA ZA GENERISANJE NA RAZNIM JEZICIMA
app.post('/api/generate', async (req, res) => {
    const { topic, type, lang } = req.body;
    
    let systemRole = `Ti si Almo BiH Expert AI. Piši isključivo na jeziku: ${lang}. `;
    if(type === 'blog') systemRole += "Piši dugačak, informativan blog sa naslovima.";
    if(type === 'stihovi') systemRole += "Piši emotivne stihove za pjesmu sa [Verse] i [Chorus].";
    if(type === 'opis') systemRole += "Piši privlačan opis za prodaju proizvoda.";
    if(type === 'status') systemRole += "Piši kratak i upečatljiv status za mreže.";
    if(type === 'seo') systemRole += "Generiši 10 SEO ključnih riječi.";

    try {
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemRole },
                { role: "user", content: topic }
            ]
        }, { headers: { "Authorization": `Bearer ${GROQ_KEY}` } });

        stats.generated++;
        res.json({ text: response.data.choices[0].message.content });
    } catch (e) {
        res.status(500).json({ error: "Greška na serveru." });
    }
});

// POVEĆAJ POSJETE
app.get('/api/visit', (req, res) => {
    stats.visits++;
    res.json(stats);
});

// STVARNI LAJK
app.post('/api/like', (req, res) => {
    stats.likes++;
    res.json({ totalLikes: stats.likes });
});

app.listen(PORT, () => console.log(`🚀 Almo BiH Studio na portu ${PORT}`));