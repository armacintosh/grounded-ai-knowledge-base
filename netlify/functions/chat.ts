import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, history } = JSON.parse(event.body || '{}');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ text }),
    };

  } catch (error) {
    console.error('Error in chat function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate response' }),
    };
  }
};