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

  '.':'⠲', ',':'⠂', '?':'⠦', '!':'⠖',
  ';':'⠆', ':':'⠒', '-':'⠤',
  "'":'⠄', '"':'⠶', '/':'⠌',
  '@':'⠈', '#':'⠼', '&':'⠯',
  '(':'⠶', ')':'⠶'
};

const CAPITAL = '⠠';

/* ---------------- TRANSLATION ---------------- */

function translate(text) {
  let result = '';

  for (let char of text) {
    if (char >= 'A' && char <= 'Z') {
      result += CAPITAL + (brailleMap[char.toLowerCase()] || '');
    } else {
      result += brailleMap[char] || '';
    }
  }

  return result;
}

/* ---------------- FLIP ---------------- */

function flipChar(ch){
  const code = ch.charCodeAt(0);
  if(code < 0x2800 || code > 0x28FF) return ch;

  let d = code - 0x2800;

  let flipped =
    ((d>>3)&1)<<0 |
    ((d>>4)&1)<<1 |
    ((d>>5)&1)<<2 |
    ((d>>0)&1)<<3 |
    ((d>>1)&1)<<4 |
    ((d>>2)&1)<<5;

  return String.fromCharCode(0x2800 + flipped);
}

function flip(text){
  return text.split('').map(flipChar).join('');
}

/* ---------------- MIRROR ---------------- */

function mirror(text){
  return text.split('').reverse().join('');
}

/* ---------------- PIPELINE ---------------- */

function transform(text){
  const braille = translate(text);
  const flipped = flip(braille);
  return mirror(flipped);
}

/* ---------------- API ---------------- */

app.post('/translate',(req,res)=>{
  const { text } = req.body;
  res.json({ result: transform(text) });
});

/* ---------------- SERVER ---------------- */

app.listen(5001, ()=>console.log("Server running on port 5001"));