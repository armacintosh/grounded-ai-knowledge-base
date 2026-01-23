import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { message, history, type = 'chat' } = JSON.parse(event.body || '{}');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return { statusCode: 500, body: JSON.stringify({ error: 'Server configuration error' }) };
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    if (type === 'embedding') {
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(message);
      return {
        statusCode: 200,
        body: JSON.stringify({ embedding: result.embedding.values }),
      };
    } else if (type === 'generate') {
      // Single turn generation (used for RAG enhancement)
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      const result = await model.generateContent(message);
      const response = await result.response;
      return {
        statusCode: 200,
        body: JSON.stringify({ text: response.text() }),
      };
    } else {
      // Default Chat
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
      const chat = model.startChat({
        history: history || [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });

      const result = await chat.sendMessage(message);
      const response = await result.response;
      return {
        statusCode: 200,
        body: JSON.stringify({ text: response.text() }),
      };
    }

  } catch (error) {
    console.error('Error in chat function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate response' }),
    };
  }
};