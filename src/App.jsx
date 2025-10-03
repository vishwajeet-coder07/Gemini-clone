import './App.css'
import { GoogleGenAI } from '@google/genai';
import {API_URL} from './assets/constants'
import { useState } from 'react'
import React from 'react'

function App() {

  const [input, setInput] = useState("");
  const [result, setResult] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

const payload = {
  "contents":[{
    "parts":[{"text": `${input}`}]
  }]
}


const renderFormattedText = (text) => {
  if (!text) return null;
  
  const parts = text.split(/\n\s*\n/);
  
  return parts.map((part, partIndex) => {
    if (!part.trim()) return null;
    

    const lines = part.split('\n').filter(line => line.trim());
    
    return (
      <div key={partIndex} className="mb-6 last:mb-0">
        {lines.map((line, lineIndex) => {
          const trimmedLine = line.trim();
          
          const isHeading = /\*\*.*\*\*/.test(trimmedLine) || 
                           (/^#{1,3}\s/.test(trimmedLine)) ||
                           (trimmedLine.length < 80 && 
                            (trimmedLine.endsWith(':') || 
                             /^[A-Z][^.]*:?$/.test(trimmedLine)));
          
          const isBulletPoint = /^[*\-•]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine);
          
          let cleanText = trimmedLine
            .replace(/\*\*/g, '') // Remove ** markers
            .replace(/^[*\-•]\s/, '') // Remove bullet markers
            .replace(/^#{1,3}\s/, '') // Remove # markers
            .replace(/^\d+\.\s/, ''); // Remove number markers
          
          if (isHeading) {
            return (
              <h3 key={lineIndex} className="text-white font-semibold text-lg mb-3 mt-4 first:mt-0">
                {cleanText}
              </h3>
            );
          } else if (isBulletPoint) {
            return (
              <div key={lineIndex} className="flex items-start mb-2">
                <span className="text-gray-400 mr-3 mt-1">•</span>
                <p className="text-gray-200 leading-relaxed flex-1">
                  {cleanText}
                </p>
              </div>
            );
          } else {
            return (
              <p key={lineIndex} className="text-gray-200 leading-relaxed mb-3">
                {cleanText}
              </p>
            );
          }
        })}
      </div>
    );
  });
};
const query = async () => {
  if (!input.trim()) return;
  
  setIsLoading(true);
  try {
    let response = await fetch(`${API_URL}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let data = await response.json();  
    let dataString = data.candidates[0].content.parts[0].text;
    
    console.log('Response received:', dataString);
    setResult(dataString);
  } catch (error) {
    console.error('Error fetching data:', error);
    setResult(['Error: Unable to get response. Please try again.']);
  } finally {
    setIsLoading(false);
  }
}

  return (
<div className='bigContainer min-h-screen bg-zinc-950 p-4'  >

  <div className='container w-full max-w-4xl min-h-96 max-h-screen text-white m-auto rounded-2xl 
   p-6 mb-10 mt-8 overflow-y-auto bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 backdrop-blur-sm' >
    
    {
      isLoading ? (
        <div className='flex items-center justify-center h-full'>
          <div className='text-center'>
            <div className='animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4'></div>
            <h1 className='text-zinc-400 text-xl'>Generating response...</h1>
          </div>
        </div>
      ) : result === undefined ? 
        <div className='flex items-center justify-center h-full'>
          <h1 className='text-zinc-400 text-xl'>Your results will appear here</h1>
        </div> :
        <div className='w-full h-full'>
          <div className='prose prose-invert max-w-none'>
            {typeof result === 'string' && result.trim() ? (
              <div className='text-gray-200'>
                {renderFormattedText(result)}
              </div>
            ) : (
              <div className='text-center text-zinc-400 p-4'>
                <p>No results to display</p>
              </div>
            )}
          </div>
        </div>
    }
    
    </div>

    <div className='bg-zinc-800 w-full max-w-4xl h-20 text-white m-auto rounded-2xl border border-zinc-400 flex items-center justify-center p-3' >
       <input 
         type="text" 
         placeholder='Ask anything...' 
         value={input}
         onChange={(e)=>setInput(e.target.value)}
         onKeyPress={(e) => e.key === 'Enter' && query()}
         disabled={isLoading}
         className='w-full h-full bg-transparent outline-none p-2 resize-none placeholder-zinc-500 disabled:opacity-50' 
       />
       <button 
         type='submit' 
         onClick={query}
         disabled={isLoading || !input.trim()}
         className='ml-3 px-4 py-2 bg-zinc-600 disabled:bg-zinc-600 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-medium'
       >
         {isLoading ? 'Asking...' : 'Ask'}
       </button>
    </div>

</div>
  )
}

export default App
