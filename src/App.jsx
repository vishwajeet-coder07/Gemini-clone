import './App.css'
import { GoogleGenAI } from '@google/genai';
import {API_URL} from './assets/constants'
import { useState, useEffect } from 'react'
import React from 'react'
import GeminiLogo from './assets/Gemini.png'

function App() {

  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = GeminiLogo;
  }, []);

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
            .replace(/\*\*/g, '') 
            .replace(/^[*\-•]\s/, '')
            .replace(/^#{1,3}\s/, '') 
            .replace(/^\d+\.\s/, '');
          
          if (isHeading) {
            return (
              <h3 key={lineIndex} className="text-white font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 mt-2 sm:mt-4 first:mt-0">
                {cleanText}
              </h3>
            );
          } else if (isBulletPoint) {
            return (
              <div key={lineIndex} className="flex items-start mb-2">
                <span className="text-gray-400 mr-3 mt-1">•</span>
                <p className="text-gray-200 leading-relaxed flex-1 text-xs sm:text-sm">
                  {cleanText}
                </p>
              </div>
            );
          } else {
            return (
              <p key={lineIndex} className="text-gray-200 leading-relaxed mb-2 sm:mb-3 text-xs sm:text-sm">
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
  
  const userMessage = input.trim();
  

  const payload = {
    "contents":[{
      "parts":[{"text": userMessage}]
    }]
  };

  setConversation(prev => [...prev, { type: 'user', content: userMessage }]);
  setInput('');
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
    
    // Add AI response to conversation
    console.log('Response received:', dataString);
    setConversation(prev => [...prev, { type: 'ai', content: dataString }]);
  } catch (error) {
    console.error('Error fetching data:', error);
    setConversation(prev => [...prev, { type: 'ai', content: 'Error: Unable to get response. Please try again.' }]);
  } finally {
    setIsLoading(false);
  }
}

  return (
<div className='bigContainer h-screen bg-zinc-900 p-2 sm:p-4 flex flex-col overflow-none'>

  <nav className='flex flex-row items-center w-full max-w-4xl mx-auto mb-10 px-2 pt-2'>
    <div className='absolute left-0 ml-2' >
      <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-zinc-400'>Gemini</h1>
    </div>
    <div className='flex items-center gap-3 absolute right-0 mr-2 mt-4'>
      <div className='h-6 sm:h-7 px-2 sm:px-3 rounded-lg text-xs text-white font-bold flex items-center justify-center bg-zinc-400/20'>PR0</div>
      <div className='bg-blue-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-white text-sm sm:text-xl'>V</div>
    </div>
  </nav>

  <div className='container w-full max-w-4xl flex-1 text-white mx-auto rounded-xl sm:rounded-2xl
     p-3 sm:p-6 mb-3 sm:mb-4 overflow-y-auto scrollbar-hide backdrop-blur-sm '>

    {
      conversation.length === 0 && !isLoading ? (
        <div className='flex flex-col items-center justify-center h-full'>
          <h1 className='bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent text-xl sm:text-4xl md:text-4xl text-center px-4 font-semibold'>Hello, Vishwajeet</h1>
           <h1 className='text-zinc-400 text-xl sm:text-3xl md:text-4xl text-center px-4'>What should we do today?</h1>
        </div>
      ) : (
        <div className='w-full h-full space-y-6'>
          {conversation.map((message, index) => (
            <div key={index} className={`flex w-full ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              {message.type === 'user' ? (
           
                <div className='max-w-2xl'>
                  <div className='bg-zinc-700 text-white rounded-2xl rounded-tr-md px-4 py-3 '>
                    <p className='text-lg sm:text-lg leading-relaxed whitespace-pre-wrap'>{message.content}</p>
                  </div>
                  <div className='text-xs text-zinc-500 mt-1 text-right'>You</div>
                </div>
              ) : (

                <div className='max-w-4xl flex flex-row items-start gap-1'>
                  <img src={GeminiLogo} alt="Gemini Logo" className="w-6 h-6 sm:w-8 sm:h-8 mt-3 flex-shrink-0"/>
                  <div className='text-gray-200 rounded-2xl rounded-tl-md px-3 sm:px-6 py-3 sm:py-4 flex-1'>
                    <div className='prose prose-invert max-w-none'>
                      {renderFormattedText(message.content)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className='flex justify-start'>
              <div className='max-w-4xl'>
                <div className='bg-zinc-800/50 border border-zinc-700/50 text-gray-200 rounded-2xl rounded-tl-md px-6 py-4 shadow-lg'>
                  <div className='flex items-center space-x-3'>
                    <div className='animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full'></div>
                    <span className='text-zinc-400 text-xs sm:text-sm'>Gemini is thinking...</span>
                  </div>
                </div>
                <div className='text-xs text-zinc-500 mt-1'>Gemini</div>
              </div>
            </div>
          )}
        </div>
      )
    }
    
    </div>

    <div className='bg-zinc-800 w-full max-w-4xl h-16 sm:h-20 text-white mx-auto rounded-2xl border border-zinc-400 flex items-center justify-center p-2 sm:p-3 flex-shrink-0 shadow-[-2px_-8px_10px_-3px_rgba(0,0,0,0.3)]'>
       <input 
         type="text" 
         placeholder='Ask Gemini' 
         value={input}
         onChange={(e)=>setInput(e.target.value)}
         onKeyPress={(e) => e.key === 'Enter' && query()}
         className='w-full h-full bg-transparent outline-none p-1 sm:p-2 resize-none placeholder-zinc-300 disabled:opacity-50 text-1.5xl sm:text-1.5xl' 
       />
       <button 
         type='submit' 
         onClick={query}
         className='ml-2 sm:ml-3 px-2 sm:px-4 py-1 sm:py-2 bg-zinc-600 cursor-pointer rounded-lg transition-colors text-xs sm:text-sm font-n'
       >
         {isLoading ? 'Asking...' : 'Ask'}
       </button>
    </div>

</div>
  )
}

export default App
