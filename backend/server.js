const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { analyzeStartup } = require('./services/analysisService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { startup } = req.body;

    if (!startup || typeof startup !== 'string' || startup.trim().length === 0) {
      return res.status(400).json({ error: 'startup name is required and must be a non-empty string' });
    }

    const analysis = await analyzeStartup(startup.trim());
    res.json(analysis);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      error: 'Failed to analyze startup',
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
