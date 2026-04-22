const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- ENGLISH BRAILLE ---------------- */

const brailleMap = {
  a:'⠁', b:'⠃', c:'⠉', d:'⠙', e:'⠑',
  f:'⠋', g:'⠛', h:'⠓', i:'⠊', j:'⠚',
  k:'⠅', l:'⠇', m:'⠍', n:'⠝', o:'⠕',
  p:'⠏', q:'⠟', r:'⠗', s:'⠎', t:'⠞',
  u:'⠥', v:'⠧', w:'⠺', x:'⠭', y:'⠽', z:'⠵',

  ' ':' ',

  // punctuation
  '.':'⠲', ',':'⠂', '?':'⠦', '!':'⠖',
  ';':'⠆', ':':'⠒', '-':'⠤',
  "'":'⠄', '"':'⠶', '/':'⠌',
  '@':'⠈', '#':'⠼', '&':'⠯',
  '(':'⠶', ')':'⠶'
};

const CAPITAL = '⠠';

/* ---------------- TRANSLATE ---------------- */

function translate(text) {
  let result = '';

  for (let char of text) {

    // preserve line breaks
    if (char === '\n') {
      result += '\n';
      continue;
    }

    // capital letters
    if (char >= 'A' && char <= 'Z') {
      result += CAPITAL + (brailleMap[char.toLowerCase()] || '');
    }

    // normal chars
    else {
      result += brailleMap[char] || '';
    }
  }

  return result;
}

/* ---------------- FLIP ---------------- */

function flipChar(ch) {
  const code = ch.charCodeAt(0);

  if (code < 0x2800 || code > 0x28FF) return ch;

  let d = code - 0x2800;

  let flipped =
    ((d >> 3) & 1) << 0 |
    ((d >> 4) & 1) << 1 |
    ((d >> 5) & 1) << 2 |
    ((d >> 0) & 1) << 3 |
    ((d >> 1) & 1) << 4 |
    ((d >> 2) & 1) << 5;

  return String.fromCharCode(0x2800 + flipped);
}

function flip(text) {
  return text
    .split('')
    .map(ch => (ch === '\n' ? '\n' : flipChar(ch)))
    .join('');
}

/* ---------------- MIRROR (LINE SAFE) ---------------- */

function mirror(text) {
  return text
    .split('\n')
    .map(line => line.split('').reverse().join(''))
    .join('\n');
}

/* ---------------- FINAL TRANSFORM ---------------- */

function transform(text) {
  const braille = translate(text);
  const flipped = flip(braille);
  return mirror(flipped);
}

/* ---------------- ROUTES ---------------- */

// ✅ Root route (fix for "Cannot GET /")
app.get('/', (req, res) => {
  res.send("Braille Translator Backend is running 🚀");
});

// ✅ Main API
app.post('/translate', (req, res) => {
  try {
    const { text } = req.body;

    if (text === undefined) {
      return res.status(400).json({ error: "Text is required" });
    }

    const result = transform(text);

    res.json({ result });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ---------------- SERVER ---------------- */

// 🔥 REQUIRED for Render
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});