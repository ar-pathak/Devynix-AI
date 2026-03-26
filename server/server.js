const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { analyzeWithAI } = require('./src/services/aiService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body-parser

// ─── API Routes ──────────────────────────────────────────────

// Code Analysis Route
app.post('/api/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    console.log(`Received request to analyze ${language} code...`);

    // Call the AI Service
    const analysisResult = await analyzeWithAI(code, language);
    
    // Send the structured JSON back to the frontend
    res.json(analysisResult);

  } catch (error) {
    console.error('Analysis Route Error:', error.message);
    res.status(500).json({ 
      error: 'AI Analysis failed.', 
      details: error.message 
    });
  }
});

// Health check route (Useful for Render/Vercel deployment)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Devynix Backend is running!', timestamp: new Date().toISOString() });
});

// ─── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});