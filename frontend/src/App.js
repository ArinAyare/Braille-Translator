import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    "https://braille-translator-kg5f.onrender.com/translate";

  useEffect(() => {
    if (!text) {
      setOutput("");
      return;
    }

    const timer = setTimeout(() => {
      translateText(text);
    }, 400);

    return () => clearTimeout(timer);
  }, [text]);

  const translateText = async (input) => {
    try {
      setLoading(true);

      const res = await axios.post(
        API_URL,
        { text: input },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", res.data);

      setOutput(res.data.result);
    } catch (err) {
      console.error("Error:", err);

      // 🔥 Retry once (for Render sleep)
      try {
        await new Promise((r) => setTimeout(r, 2000));

        const retry = await axios.post(
          API_URL,
          { text: input },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setOutput(retry.data.result);
      } catch {
        setOutput("Server waking up... please try again ⏳");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="app">
      <div className="card">
        <h1>BeingJigyaasu's Braille Translator</h1>

        <label>Enter Text</label>
        <textarea
          placeholder="Type text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <label>Braille Output (Flipped + Mirrored)</label>
        <textarea
          value={loading ? "Translating..." : output}
          readOnly
        />

        <button onClick={copyToClipboard}>
          Copy Output
        </button>
      </div>
    </div>
  );
}

export default App;