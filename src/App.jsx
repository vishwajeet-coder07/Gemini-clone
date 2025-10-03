import './App.css'
import { GoogleGenAI } from '@google/genai';
import {URL} from './assets/constants'
import { useState } from 'react'
import React from 'react'

function App() {

  const [input, setInput] = useState("");
const [result, setResult] = useState(undefined)

const payload = {
  "contents":[{
    "parts":[{"text": `${input}`}]
  }]
}
const query = async () => {
  // console.log(input);
  let response = await fetch(`${URL}`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  let data = await response.json();
  // console.log(data.candidates[0].content.parts[0].text);
  setResult(data.candidates[0].content.parts[0].text);
}

  return (
<div className='bigContainer'>

  <div className='container w-320 h-110 text-white m-auto rounded-2xl border-zinc-400 flex items-center justify-center
   p-3 mb-10 mt-10 overflow-scroll' >
    {result}
    </div>

    <div className='bg-zinc-800 w-1/2 h-20 text-white m-auto rounded-2xl border border-zinc-400 flex items-center justify-center
     p-3' >

       <input type="text" placeholder='Ask anything...' onChange={(e)=>setInput(e.target.value)} className='w-full h-full bg-transparent outline-none p-2 resize-none' />
       <button type='submit' onClick={query}>Ask</button>

    </div>

</div>
  
  )
}

export default App
