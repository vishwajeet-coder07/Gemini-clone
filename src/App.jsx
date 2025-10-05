import './App.css'
import { useState, useEffect } from 'react'
import React from 'react'
import Navigation from './components/Navigation'
import ChatContainer from './components/ChatContainer'
import ChatInput from './components/ChatInput'
import { useGeminiAPI } from './hooks/useGeminiAPI'
import GeminiLogo from './assets/Gemini.png'

function App() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const { isLoading, sendMessage, stopResponse } = useGeminiAPI();

  useEffect(() => {
    const img = new Image();
    img.src = GeminiLogo;
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setConversation(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    
    sendMessage(
      userMessage,
      (response) => {
        setConversation(prev => [...prev, { type: 'ai', content: response }]);
      },
      (errorMessage) => {
        setConversation(prev => [...prev, { type: 'ai', content: errorMessage }]);
      }
    );
  };

  return (
    <div className='bigContainer h-screen bg-zinc-900 p-2 sm:p-4 flex flex-col overflow-none'>
      <Navigation />
      <ChatContainer conversation={conversation} isLoading={isLoading} />
      <ChatInput 
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={stopResponse}
      />
    </div>
  )
}

export default App
