const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
function transformSentence(sentence) {
    if (typeof sentence !== 'string') {
        throw new TypeError('sentence must be a string');
    }

    const tokens = sentence.trim() === '' ? [] : sentence.trim().split(/\s+/);
    const word_count = tokens.length;
    const seen = new Set();
    const unique_words = [];

    for (const t of tokens) {
        const lower = t.toLowerCase();
        if (!seen.has(lower)) {
            seen.add(lower);
            unique_words.push(lower);
        }
    }

    const reversed_sentence = tokens.slice().reverse().join(' ');
    return { word_count, unique_words, reversed_sentence };
}

app.post('/api/transform', (req, res) => {
    try {
        const { sentence } = req.body;
        if (typeof sentence !== 'string') {
            return res.status(400).json({
                error: '`sentence` is required and must be a string'
            });
        }

        const result = transformSentence(sentence);
        return res.json(result);
    }
    catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'internal server error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serve running at http://localhost:${PORT}`);
});