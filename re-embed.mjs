import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

// Manually read .env to get the key
const envContent = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in .env');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function reEmbed() {
    const nodeNames = fs.readFileSync('public/data/node_names.txt', 'utf-8')
        .split('\n')
        .filter(Boolean);

    const embeddings = {};

    for (const name of nodeNames) {
        console.log(`Embedding ${name}...`);
        const label = `${name.replace(/_/g, ' ')} field`;
        const result = await model.embedContent(label);
        embeddings[name] = result.embedding.values;
    }

    fs.writeFileSync('public/data/node_embeddings.json', JSON.stringify(embeddings, null, 2));
    console.log('Done re-embedding 91 nodes!');
}

reEmbed().catch(console.error);
