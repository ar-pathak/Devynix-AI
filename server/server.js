const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock code analysis function
function analyzeCode(code, language) {
  // Simple analysis - count lines, functions, etc.
  const lines = code.split('\n').length;
  const functions = (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(|def\s+\w+|public\s+\w+|private\s+\w+/g) || []).length;
  const comments = (code.match(/\/\/|\/\*|#|'''|"""/g) || []).length;

  return {
    language,
    metrics: {
      linesOfCode: lines,
      functions: functions,
      comments: comments,
      complexity: Math.min(10, Math.floor(lines / 10) + functions),
    },
    suggestions: [
      lines > 50 ? 'Consider breaking down large functions' : 'Code size looks good',
      functions === 0 ? 'Add some functions to organize your code' : 'Good function structure',
      comments < lines * 0.1 ? 'Add more comments for better readability' : 'Good commenting',
    ].filter(Boolean),
    timestamp: new Date().toISOString(),
  };
}

// API Routes
app.post('/api/analyze', (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const analysis = analyzeCode(code, language);
    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});