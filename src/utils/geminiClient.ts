// GoogleGenerativeAI imports removed as we are now using fetch to proxy to Netlify Functions

export class GeminiClient {
    private chatHistory: { role: string, parts: { text: string }[] }[] = [];

    constructor(_apiKey: string) {
        // API key is no longer needed on the client, but keeping constructor signature for now
        // to minimize changes in consumer code.
    }

    async initialize() {
        this.chatHistory = [];
        return { name: "Gemini Assistant" };
    }

    async createThread() {
        this.chatHistory = [];
        return { id: "gemini-thread" };
    }

    async ensureInitialized() {
        // No-op for proxy client
    }

    async *streamMessage(content: string, signal?: AbortSignal): AsyncGenerator<string, void, unknown> {
        try {
            const response = await fetch('/.netlify/functions/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: content,
                    history: this.chatHistory
                }),
                signal
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            const data = await response.json();
            const text = data.text;

            // Update local history
            this.chatHistory.push({ role: 'user', parts: [{ text: content }] });
            this.chatHistory.push({ role: 'model', parts: [{ text: text }] });

            // Yield the full text (simulating stream for compatibility)
            yield text;

        } catch (error) {
            if (signal?.aborted) {
                throw new Error('Request cancelled');
            }
            console.error('Gemini Proxy Error:', error);
            throw error;
        }
    }
}
