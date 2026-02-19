const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Placeholder for /api/analyze endpoint (to be implemented)
app.post('/api/analyze', (req, res) => {
  res.status(501).json({ error: 'Endpoint not yet implemented' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
