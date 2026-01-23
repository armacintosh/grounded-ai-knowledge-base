ollow this specialized UX/UI specification. This guide adapts the "Epistemic Clarity" philosophy to spatial data.

1. Core Visual Tokens
The Palette: Maintain the institutional, calm tones.
Background: #E1E9EA (Arctic Mist) with the bg-academic-grid (40px overlay).
Primary Action/Data Points: #597E6D (Sage Leaf) for buttons and active map layers.
Typography: Inter for UI/Labels, JetBrains Mono for coordinates and metadata.
The "Sharp Edge" Rule: No rounded corners (rounded-none). All buttons, containers, and map tooltips must have 90-degree angles.
2. Component-Specific Styling
2.1 The Map Interface (Spatial Canvas)
Basemap: Use a monochromatic or grayscale basemap (Carto Positron or custom Mapbox style) to allow data layers to stand out.
Map Controls: Positioned top-right or top-left in square white boxes with border-slate-900/10. Use thin 1px icons.
Scale Bar: Use JetBrains Mono for the scale text.
Coordinate Display: A small box at the bottom-left showing LAT: XX.XXXX / LON: XX.XXXX in mono font.
2.2 The Geographic Chatbot (Panel Strategy)
Instead of a floating bubble, the chatbot should be an integrated Panel.

Layout: A collapsible side panel (Right or Left) that mirrors the "Metadata Verification" panel from the GlassBox lab.
Message Bubbles: Use square cards.
User: bg-slate-100 with border-l-4 border-slate-900.
AI: bg-white with border-l-4 border-sage-600.
Input Field: Use the Section 3.5 style from the GlassBox guide: an underline-only input with h-16 text-xl font-light.
2.3 Data Legend & Layers
Container: White background, shadow-[2px_2px_0px_0px_rgba(28,46,54,0.05)].
Layer Toggles: Use square checkboxes. When active, use the Sage Leaf green (#597E6D).
Academic Badging: If a dataset is from a specific source (e.g., NASA, USGS), use the status badge style (e.g., bg-slate-900 text-white for "VERIFIED DATA").
3. Suggested Screen Architecture
Feature	GlassBox Translation
Global Navigation	Keep the "Masthead" (Journals, Submissions...) but replace with (MAP, DATASETS, ANALYTICS, EXPORTS).
Layer Management	Treat layers like the "Ingestion Queue" table—high density, mono font for file sizes/dates.
Analysis Lab	Use the 3-panel layout: Panel A: Map View. Panel B: Data Table/Graph. Panel C: Chatbot/AI Analyst.
4. Interaction Design (UX)
State Visibility: Use the "Pulsing Blue" badge when the AI is processing a spatial query or rendering a large GeoJSON.
Commitment: When a user filters data via the chatbot, provide a "PIN TO MAP" button that uses the Primary Button style (Sage Leaf, uppercase, tracking-widest).
Hover States: When hovering over a map feature, the tooltip should look like a "Manuscript Card"—white, sharp-edged, with JetBrains Mono metadata.