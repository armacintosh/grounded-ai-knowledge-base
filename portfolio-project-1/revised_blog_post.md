# From Rehab Robotics to GraphRAG: Why Context is King

Before I was designing Generative AI architectures, I was building explainable machine learning applications for healthcare.

Specifically, I worked on systems to help Occupational Therapists guide young people with Cerebral Palsy through home-based therapy. The challenge wasn't just "detecting a movement." It was distinguishing between a therapeutic gesture and the "noisy" neurological commands often present in CP, like spasticity or muscle synergies.

To make that work, we couldn't just throw raw data at a black box. We had to build strict **calibration procedures** to personalize the system to the individual’s physiology. We had to select interpretable features—like movement variability—that gave therapists actual clinical insight rather than just a binary "pass/fail".

I carried this obsession with **context and calibration** into my recent work with Large Language Models.

Whether you are fine-tuning GPT-3.5 to provide personalized feedback (which I explored in a recent paper) or building a documentation assistant, the core problem remains the same: **Without strict grounding in human context, AI is just guessing.**

Here is how I applied those lessons to a recent project: **The Urban Education Explorer**.

## The Challenge: The API Documentation Swamp

I recently tackled a massive repository of educational data from the Urban Institute. We’re talking about 3,000+ variables and 40+ endpoints—everything from student outcomes to university tax records.

The problem? The API is incredibly powerful, but accessing it requires navigating thousands of obscure variable codes like `cc_basic_2021`.

For a developer or researcher trying to use this API, finding the right parameter is a nightmare. A standard "out-of-the-box" chatbot has no idea what `cc_basic_2021` means. If you ask it how to find "admission rates," it will likely hallucinate a variable name that sounds plausible but doesn't exist in the documentation.

I needed a way to "calibrate" the AI to the **API documentation**, ensuring it could guide users to the authoritative variable codes they actually needed.

## The Solution: Client-Side GraphRAG as a Documentation Navigator

I built a custom, lightweight **GraphRAG (Graph Retrieval-Augmented Generation)** architecture.

Crucially, this system **does not analyze the university data itself**. Instead, it analyzes the **metadata**—the descriptions, formats, and relationships of the 3,000+ variable codes. It acts as an intelligent layer on top of the technical documentation.

Here is the architecture breakdown:

### 1. Intent Understanding (The Embedding)

Just like we had to capture the "intent" of a hand movement despite muscle tremors, we first need to capture the intent of the user's query.
When a user asks, "What variable do I use for diversity stats?", a **Netlify Function** proxies that text to **Google’s Gemini Embedding Model (text-embedding-004)**. This converts the fuzzy human language into a precise mathematical vector.

### 2. The Search (Client-Side Vector Retrieval)

We don't send that vector to the LLM yet. Instead, the application runs a **Cosine Similarity search** right in the browser, checking against a pre-computed vector store (`node_embeddings.json`) of variable descriptions.
This "Grounding" step ensures the system is locked onto the official documentation before it ever tries to generate an answer.

### 3. Contextualization (The Inference "Graph")

This is the most critical step. In my rehab work, we used "Context Expansion" to map a muscle signal to a clinical outcome. Here, I built a **Rule-Based Inference Engine** that acts as a Knowledge Graph.
Instead of just retrieving a code like `cc_basic_2021`, the system procedurally generates its context by parsing the code structure:

* *Where does this variable live?* (Inferred via dataset relationship tags)
* *What is the data format?* (Inferred via nomenclature patterns, e.g., 'pct' -> Percentage)

This creates a "virtual graph" of relationships without needing a heavy graph database.

### 4. Synthesis (The Response)

Finally, we package the original question + the retrieved variable codes and their inferred context, and send them to **Gemini Flash Lite (gemini-2.5-flash-lite)** via our Netlify proxy.
Because we have "calibrated" the prompt with the exact API parameters required, the model doesn't hallucinate. It accurately tells the user: *"You are looking for `cc_basic_2021`, which represents the Carnegie Classification."*

## The Result: Democratized Access

The **Urban Education Explorer** transforms a dense technical documentation site into a conversational interface.

It allows users to ask high-level questions in plain English and instantly receive the precise, authoritative codes they need to query the database. It successfully disambiguates between thousands of similar variable names, ensuring that researchers are building their analysis on the correct underlying data fields.

## Why This Matters

In the rush to adopt Generative AI, it is easy to forget that these models are statistical predictors, not truth machines.

My experience in pre-GenAI machine learning taught me that **interpretable features** and **human context** are not optional add-ons; they are the foundation of a reliable system.

Whether interpreting the muscle signals of a child with CP or navigating the schema of a massive government database, the goal is the same: **Use the AI to translate the user's intent, but use your architecture to ground the AI in reality.**

If you are struggling to make your complex API documentation accessible, let's connect. I help organizations build AI systems that actually understand their data structure.
