import { GoogleGenerativeAI, GenerativeModel, ChatSession } from '@google/generative-ai';

export class GeminiClient {
    private genAI: GoogleGenerativeAI;
    private model: GenerativeModel;
    private chat: ChatSession | null = null;
    private retryCount: number = 0;
    private readonly maxRetries: number = 3;
    private readonly baseDelay: number = 2000;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
    }

    async initialize() {
        this.chat = this.model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });
        return { name: "Gemini Assistant" }; // Mocking assistant object
    }

    async createThread() {
        // Gemini chat session is already created in initialize or can be reset here
        this.chat = this.model.startChat();
        return { id: "gemini-thread" };
    }

    // Method to match the previous AssistantClient signature roughly
    async ensureInitialized() {
        if (!this.chat) {
            await this.initialize();
        }
    }

    private async exponentialBackoff(): Promise<void> {
        const delay = this.baseDelay * Math.pow(2, this.retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        this.retryCount++;
    }

    private resetRetryCount(): void {
        this.retryCount = 0;
    }

    async *streamMessage(content: string, signal?: AbortSignal): AsyncGenerator<string, void, unknown> {
        if (!this.chat) {
            throw new Error('Chat session not initialized');
        }

        try {
            const result = await this.chat.sendMessageStream(content);

            for await (const chunk of result.stream) {
                if (signal?.aborted) {
                    throw new Error('Request cancelled');
                }
                const text = chunk.text();
                yield text;
            }

        } catch (error) {
            if (error instanceof Error) {
                if (signal?.aborted) {
                    throw new Error('Request cancelled');
                }
                if (this.retryCount < this.maxRetries) {
                    console.warn(`Retrying request... Attempt ${this.retryCount + 1}`);
                    await this.exponentialBackoff();
                    yield* this.streamMessage(content, signal);
                } else {
                    this.resetRetryCount();
                    throw error;
                }
            }
            throw new Error('An unexpected error occurred: ' + error);
        }
    }
}
