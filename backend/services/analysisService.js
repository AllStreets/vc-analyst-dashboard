const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory cache for analyses
const analysisCache = new Map();

const buildAnalysisPrompt = (startupName) => {
  return `You are a expert VC analyst. Analyze the startup "${startupName}" and provide a comprehensive investment analysis.

Return a JSON response with EXACTLY this structure (no additional fields):
{
  "competitive": {
    "competitors": [
      {
        "name": "Competitor Name",
        "description": "Brief description",
        "positioning": "Market positioning",
        "threatLevel": 1-10
      }
    ],
    "differentiation": "What makes this startup unique",
    "marketPositioning": "How they position themselves"
  },
  "market": {
    "tam": "$X.XB",
    "sam": "$X.XB",
    "som": "$X.XM",
    "cagr": "X%",
    "segments": ["Segment 1", "Segment 2", "Segment 3"],
    "growthTrajectory": "Description of market growth"
  },
  "founder": {
    "team": [
      {
        "name": "Name",
        "title": "Title",
        "background": "Brief background",
        "experience": "X years in industry"
      }
    ],
    "trackRecord": "Success/failure summary",
    "domainExpertise": "Match to market",
    "founderMarketFit": 1-10
  },
  "thesis": {
    "recommendation": "go" or "no-go" or "watch",
    "confidence": 1-100,
    "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
    "risks": ["Risk 1", "Risk 2", "Risk 3"],
    "oneLiner": "One sentence investment thesis"
  },
  "metadata": {
    "confidenceCompetitive": "high|medium|low",
    "confidenceMarket": "high|medium|low",
    "confidenceFounder": "high|medium|low"
  }
}

If you cannot find reliable information about this startup, use your best judgment and adjust confidence levels accordingly. Always return valid JSON.`;
};

const analyzeStartup = async (startupName) => {
  try {
    // Check cache first
    if (analysisCache.has(startupName)) {
      console.log(`Cache hit for ${startupName}`);
      return analysisCache.get(startupName);
    }

    console.log(`Analyzing ${startupName}...`);

    const message = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: buildAnalysisPrompt(startupName),
        },
      ],
    });

    // Extract JSON from response
    const responseText = message.choices[0].message.content;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from OpenAI');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Cache the result
    analysisCache.set(startupName, analysis);

    return analysis;
  } catch (error) {
    console.error('Error analyzing startup:', error);
    throw error;
  }
};

module.exports = {
  analyzeStartup,
};
