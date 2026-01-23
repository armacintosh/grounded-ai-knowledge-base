# Portfolio Item: Urban Education Explorer

## Urban Education Explorer

**Live Demo**: [https://public-data-graph-rag.netlify.app/](https://public-data-graph-rag.netlify.app/)


### Challenge
The Urban Institute maintains one of the most comprehensive datasets on educational institutions in the United States, including data from IPEDS (Integrated Postsecondary Education Data System) and other sources. However, this wealth of information is locked behind complex technical documentation and thousands of obscure variable codes (e.g., `cc_basic_2021`, `hhinc_home_zip_med`). Researchers and policymakers often struggle to identify the exact data points they need without extensive manual lookup, making it difficult to answer simple questions like "Which schools have the highest poverty rates in their home zip codes?" or "How do admission rates correlate with instruction costs?"

### Our Approach
We built the **Urban Education Explorer**, an intelligent web application designed to bridge the gap between complex data repositories and human curiosity. The core of this solution is a specialized **GraphRAG (Graph Retrieval-Augmented Generation)** architecture designed specifically to "understand" the Urban Education Data Set.

*   **GraphRAG for Data Codes**: Unlike standard AI chatbots that might hallucinate variable names, our system uses semantic vector search to map natural language queries directly to the authoritative variable codes in the database. When a user asks a question, the system retrieves the most relevant "codes" from the dataset documentation.
*   **Knowledge Graph Context**: These codes are not just retrieved as text; they are understood as nodes in a knowledge graph. The system identifies relationships—such as which directory a variable belongs to (e.g., IPEDS), its format (percentage, currency), and its entity type. This allows the AI to construct accurate, data-grounded answers.
*   **Interactive Visualization**: Beyond chat, we integrated a full feature suite including interactive **Leaflet maps** for geospatial analysis and rich data tables. Users can filter institutions by specific criteria and see the results instantly on a map, or switch to the "Applicants" view to analyze student demographics and application flows.

### Results & Impact
*   **Democratized Data Access**: Transformed a technical API documentation site into a conversational interface, allowing non-technical users to query the database using plain English.
*   **Accurate Code Retrieval**: The GraphRAG system successfully disambiguates between thousands of similar variable names, ensuring that the analysis is based on the correct underlying data fields.
*   **Unified Analysis Workflow**: users can move seamlessly from asking high-level questions in the Chat interface to deep-diving into specific schools in the Explorer view, with all complex data codes handled automatically in the background.

### Visual Assets

![Interactive Map View showing clustered educational institutions](/Users/alexandermacintosh/Documents/GitHub/prototypes/urban-education-explorer-w-graph-rag/portfolio-project-1/map_view.png)
*Fig 1: The Colleges view allows users to explore institutions geographically.*

![Applicant Profile Analysis](/Users/alexandermacintosh/Documents/GitHub/prototypes/urban-education-explorer-w-graph-rag/portfolio-project-1/applicant_profile.png)
*Fig 2: Deep dive into applicant demographics and admission probability analysis.*

![GraphRAG Chat Interface](/Users/alexandermacintosh/Documents/GitHub/prototypes/urban-education-explorer-w-graph-rag/portfolio-project-1/chat_interface.png)
*Fig 3: The Chat interface uses GraphRAG to map natural language queries to specific database codes (shown in the "Graph Context" panel).*


### Tech Stack
*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI & Logic**: Google Gemini (via Google Generative AI SDK), GraphRAG Architecture (Custom implementation with Vector Search + Knowledge Graph logic)
*   **Mapping**: Leaflet, React Leaflet
*   **Backend**: Netlify Functions (Serverless)
*   **Data Processing**: Client-side Vector Search (Cosine Similarity), Local JSON Data Stores
