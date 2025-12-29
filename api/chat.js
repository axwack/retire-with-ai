import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export default async function handler(req, res) {
  // Enable CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: process.env.AIRA_PROTOCOL || 'You are a helpful assistant.',
      messages: [
        { role: 'user', content: message }
      ]
    });

    // Return response
    return res.status(200).json({
      reply: response.content[0].text,
      tokensUsed: response.usage.input_tokens + response.usage.output_tokens
    });

  } catch (error) {
    console.error('Claude API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to get response from Claude',
      details: error.message 
    });
  }
}