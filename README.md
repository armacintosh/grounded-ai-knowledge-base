# Grounded AI Knowledge Base (GraphRAG)

[🌐 Visit Grounded Scientific](https://alexandermacintosh.ca/) | [📅 Book a Strategy Call](https://calendar.app.google/mWcfwiGYS5trNMer6)

> **Project Context:** A "Glass Box" RAG system designed to navigate complex public datasets (Urban Institute Education Data).
> **Business Value:** Solving the "Retrieval Problem" in AI by using GraphRAG to map natural language queries to authoritative data codes (3,000+ variables) without hallucination.
> **Status:** Active Proof-of-Concept & Reference Architecture

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Netlify-00AD9F)](https://public-data-graph-rag.netlify.app/)

---

### 🔬 Scientific Basis
Standard RAG (Retrieval-Augmented Generation) often fails when dealing with highly structured, code-heavy databases. This repository demonstrates a **GraphRAG approach** that treats data documentation as a knowledge graph, not just text chunks.

**The Challenge:**
The Urban Institute API contains over **3,000+ variables** across 40+ endpoints. Navigating obscure codes (e.g., `cc_basic_2021`) typically requires manual lookup.

**The Solution:**
* **Semantic Code Mapping:** Uses semantic vector search to map plain English questions ("Show me graduation rates") to the exact underlying variable codes.
* **Knowledge Graph Context:** Identifies relationships between variables (e.g., directory source, format, entity type) to ensure the AI understands *what* it is querying.
* **Verifiable Outputs:** The system cites the specific data tables used, ensuring transparency ("Glass Box" AI).

---

### ⚠️ Implementation Note
This repository serves as a **demonstration of the Grounded Scientific RAG Architecture**. It is currently configured to ingest and query the **Urban Institute Education Data API**, but the underlying logic is domain-agnostic and can be adapted for clinical trials, legal discovery, or internal enterprise search.

---

### 📂 Key Features & Workflow

#### 1. Generative Chat (GraphRAG)
Maps natural language to strict schema definitions.
* *User asks:* "What is the admission rate for schools in New York?"
* *System:* Identifies `ADM_RATE`, filters by `STABBR=NY`, and returns a grounded answer.

#### 2. Geospatial Intelligence
Interactive Leaflet maps that visualize the retrieved data points, allowing for instant "Calculated Geomaps" based on the query results.

#### 3. Contextual Analysis
Deep-dive views into specific entities (e.g., "Applicant Profiles"), comparing local metrics against national aggregated datasets using serverless functions.

---

### 🛠 Tech Stack
* **AI & Logic:** Google Gemini (via Google Generative AI SDK), Custom GraphRAG Architecture.
* **Vector Search:** Client-side Cosine Similarity for low-latency retrieval.
* **Frontend:** React, TypeScript, Tailwind CSS.
* **Mapping:** Leaflet, React Leaflet.
* **Infrastructure:** Netlify Functions (Serverless Backend).

### 📚 Citations & Data Sources
This project is built upon the open data initiatives provided by the Urban Institute.
* **Data Source:** [Urban Institute Education Data Portal](https://educationdata.urban.org/)
* **Methodology:** MacIntosh, A. (2025). *GraphRAG for Data Codes: Bridging the Semantic Gap in Educational Data*. [Link to Portfolio](https://alexandermacintosh.ca/portfolio/projects/project-1/)

---

### 🔄 Dependencies
To run this locally, ensure you have the following configured:
1. **Node.js** (v18+)
2. **Google Gemini API Key** (for generation)
3. **Netlify CLI** (for serverless function emulation)

```bash
# Install dependencies
npm install

# Run local development server
npm start
