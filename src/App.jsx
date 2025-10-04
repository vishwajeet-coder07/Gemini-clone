import './App.css'
import { GoogleGenAI } from '@google/genai';
import {API_URL} from './assets/constants'
import { useState } from 'react'
import React from 'react'

function App() {

  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]); // Array to store conversation history
  const [isLoading, setIsLoading] = useState(false);

// Payload will be created dynamically in the query function

// Function to render formatted text like real Gemini
const renderFormattedText = (text) => {
  if (!text) return null;
  
  // Split text into paragraphs and process each part
  const parts = text.split(/\n\s*\n/);
  
  return parts.map((part, partIndex) => {
    if (!part.trim()) return null;
    
    // Split by lines to handle bullet points and headings
    const lines = part.split('\n').filter(line => line.trim());
    
    return (
      <div key={partIndex} className="mb-6 last:mb-0">
        {lines.map((line, lineIndex) => {
          const trimmedLine = line.trim();
          
          // Check if line is a heading (has ** markers or matches heading patterns)
          const isHeading = /\*\*.*\*\*/.test(trimmedLine) || 
                           (/^#{1,3}\s/.test(trimmedLine)) ||
                           (trimmedLine.length < 80 && 
                            (trimmedLine.endsWith(':') || 
                             /^[A-Z][^.]*:?$/.test(trimmedLine)));
          
          // Check if line is a bullet point
          const isBulletPoint = /^[*\-•]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine);
          
          // Clean the text
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
  
  const userMessage = input.trim();
  
  // Create payload with current user message
  const payload = {
    "contents":[{
      "parts":[{"text": userMessage}]
    }]
  };
  
  // Add user message to conversation
  setConversation(prev => [...prev, { type: 'user', content: userMessage }]);
  setInput(''); // Clear input immediately
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
<div className='bigContainer h-screen bg-zinc-800 p-4 flex flex-col overflow-hidden'>
  <nav className='flex flex-row'>
<div>
  <h1 className='text-2xl font-bold text-zinc-400'>Gemini</h1>
</div>
<div className='h-7 w-15 rounded-lg mt-1 absolute right-15 text-2 text-white font-bold text-center bg-zinc-400/20'>PR0</div>
<div className='NAME bg-blue-500 rounded-full w-10 h-10 text-center font-bold text-white text-2xl pt-0.5 absolute right-2'>V</div>
  </nav>

  <div className='container w-full max-w-4xl flex-1 text-white mx-auto rounded-2xl
     p-6 mb-4 overflow-y-auto scrollbar-hide backdrop-blur-sm'>

    {
      conversation.length === 0 && !isLoading ? (
        <div className='flex items-center justify-center h-full'>
          <h1 className='text-zinc-400 text-xl'>Start a conversation with Gemini</h1>
        </div>
      ) : (
        <div className='w-full h-full space-y-6'>
          {conversation.map((message, index) => (
            <div key={index} className={`flex w-full ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              {message.type === 'user' ? (
           
                <div className='max-w-2xl'>
                  <div className='bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3 shadow-lg'>
                    <p className='text-sm leading-relaxed whitespace-pre-wrap'>{message.content}</p>
                  </div>
                  <div className='text-xs text-zinc-500 mt-1 text-right'>You</div>
                </div>
              ) : (

                <div className='max-w-4xl'><img src="src/assets/Gemini.png" alt="Logo" className="absolute left-0 w-10 h-8"/>
                  <div className='bg-zinc-800/50 border border-zinc-700/50 text-gray-200 rounded-2xl rounded-tl-md px-6 py-4 shadow-lg ml-3'>
                    <div className='prose prose-invert max-w-none'>
                      {renderFormattedText(message.content)}
                    </div>
                  </div>
                  <div className='text-xs text-zinc-500 mt-1'>Gemini</div>
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
                    <span className='text-zinc-400'>Gemini is thinking...</span>
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

    <div className='bg-zinc-800 w-full max-w-4xl h-20 text-white mx-auto rounded-2xl border border-zinc-400 flex items-center justify-center p-3 flex-shrink-0 shadow-[-2px_-8px_10px_-3px_rgba(0,0,0,0.3)]'>
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
