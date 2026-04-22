import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");

  useEffect(()=>{
    if(!text){
      setOut("");
      return;
    }

    const t = setTimeout(async()=>{
      try{
        const res = await axios.post(
          "http://localhost:5001/translate",
          { text }
        );
        setOut(res.data.result);
      }catch{
        setOut("Backend error");
      }
    },300);

    return ()=>clearTimeout(t);
  },[text]);

  return (
    <div style={{maxWidth:800, margin:"40px auto"}}>
      <h1>Braille Translator</h1>

      <textarea
        value={text}
        onChange={e=>setText(e.target.value)}
        placeholder="English / Hindi / Marathi"
        style={{width:"100%", height:120}}
      />

      <textarea
        value={out}
        readOnly
        style={{width:"100%", height:120, marginTop:20}}
      />
    </div>
  );
}

export default App;