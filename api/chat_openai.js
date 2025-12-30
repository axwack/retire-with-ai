import OpenAI from 'openai';

/* const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
*/
const openai = new OpenAI({
  apiKey: "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",
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Call OpenAI API (GPT-4)
    const response = await openai.chat.completions.create({
      model: 'gpt-5-nano', // Cheaper model for testing
      messages: [
        {
          role: 'system',
          content: process.env.AIRA_PROTOCOL || 'You are a helpful assistant.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 1024
    });

    const reply = response.choices[0].message.content;
    const tokensUsed = response.usage.total_tokens;

    return res.status(200).json({
      reply,
      tokensUsed,
      provider: 'openai' // So you know it's test mode
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to get response',
      details: error.message 
    });
  }
}
```

### Add OpenAI Key to Vercel:
1. Go to Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Add:
```
   OPENAI_API_KEY = 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
   AIRA_PROTOCOL = Your protocol text