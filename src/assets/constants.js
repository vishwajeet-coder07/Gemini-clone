// Environment variables are automatically loaded by Vite
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
