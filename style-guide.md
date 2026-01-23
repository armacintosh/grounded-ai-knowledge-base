# **GlassBox: Open Scholarship & Citation Integrity**

### **UI/UX Design System & Style Guide**

Version: 2.0.0 (Academic Edition)

Target Stack: React / TypeScript / Tailwind CSS

Design Philosophy: Epistemic Clarity. The interface is a neutral vessel for high-density information. It prioritizes the readability of citations, datasets, and peer-review audits over decoration.

---

## **1\. Core Tokens**

### **1.1 Color Palette**

The palette creates a calm, institutional environment suitable for long-form reading and data analysis.

| Token Name | Hex Code | Tailwind Name | Semantic Usage (Academic) |
| :---- | :---- | :---- | :---- |
| **Deep Slate** | \#1C2E36 | slate-900 | Primary text, DOI links, Navigation. |
| **Sage Leaf** | \#597E6D | sage-600 | "Peer Reviewed" status, Publish actions, Impact metrics. |
| **Willow Green** | \#7FA088 | sage-400 | Citation graphs, Altmetric indicators. |
| **Arctic Mist** | \#E1E9EA | slate-100 | Global canvas, DOI trace backgrounds. |
| **Pure White** | \#FFFFFF | white | Manuscript cards, Reading surfaces. |

### **1.2 Typography**

Primary: Inter (UI & Abstracts)

Data/Bibliometrics: JetBrains Mono

| Element | Size | Weight | Tracking | Case | Usage |
| :---- | :---- | :---- | :---- | :---- | :---- |
| **H1 (Display)** | 48px+ | 300 | \-0.02em | Mixed | Landing page slogans (e.g., "OPEN ACCESS"). |
| **H2 (Module)** | 14px | 700 | 0.20em | UPPER | Section headers (e.g., "BIBLIOGRAPHY"). |
| **H3 (Title)** | 18px | 600 | \-0.01em | Mixed | Manuscript Titles. |
| **Body (Serif)** | 16px | 400 | Normal | Mixed | Abstracts (Optional: use Merriweather or Inter with relaxed leading). |
| **Meta/DOI** | 12px | 500 | 0.05em | UPPER | DOIs, ORCID IDs, Dates. |
| **Code/Data** | 13px | 400 | Normal | Mixed | p-values, raw data samples. |

---

### **2.2 Spacing & Rhythm**

* **Density:** High. Academic interfaces require high data density.  
* **Margins:** Use gap-x-8 for grid layouts to separate sidebar citation tools from the main manuscript text.

---

## **3\. Component Library**

**GLOBAL RULE:** rounded-none. Academic rigor implies sharp edges. No soft corners.

### **3.1 Buttons (Action Primitives)**

* **Primary (Submit / Publish)**  
  * bg-\[\#597E6D\] text-white font-bold uppercase tracking-\[0.15em\] h-10 px-6 hover:brightness-110  
* **Secondary (Export Citation)**  
  * border border-slate-900/20 text-slate-900 font-medium text-xs uppercase tracking-widest hover:bg-white


