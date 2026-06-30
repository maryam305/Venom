# VENOM.AI — Multimodal Snakebite Intelligence


| <img width="946" height="437" alt="image" src="https://github.com/user-attachments/assets/25ceb34d-de06-44ca-98be-31bd80144036" /> | <img width="943" height="435" alt="Screenshot 2026-06-30 194405" src="https://github.com/user-attachments/assets/0f8438f5-979c-4c20-a872-99e375680439" /> |<img width="944" height="434" alt="Screenshot 2026-06-30 194420" src="https://github.com/user-attachments/assets/16c36c22-6db7-4af9-8ee4-2e41e7f28c31" />|
| :---: | :---: | :---: |
|<img width="948" height="443" alt="Screenshot 2026-06-30 194439" src="https://github.com/user-attachments/assets/e232e0eb-2418-4ee2-a93c-1229249b1888" />|<img width="946" height="442" alt="Screenshot 2026-06-30 194512" src="https://github.com/user-attachments/assets/68be789e-38fb-4ced-80d7-18586c9f199f" />|<img width="954" height="432" alt="Screenshot 2026-06-30 194759" src="https://github.com/user-attachments/assets/ecbff9f7-531f-4760-8466-1fe74eaf870b" /> |


---

## 🌍 The Problem
Snakebite envenomation is a neglected tropical disease that causes over 100,000 deaths and 400,000 amputations globally every year, with a massive burden in Sub-Saharan Africa. When a patient arrives at a rural clinic with a snakebite, medical staff face extreme challenges:
1. **Misidentification:** Knowing the exact species of snake is crucial, but victims often bring no snake or a mangled specimen. 
2. **Clinical Uncertainty:** Symptoms can take hours to manifest, and distinguishing between cytotoxic, hemotoxic, and neurotoxic syndromes requires specialized knowledge.
3. **Geographic Variations:** Snake species and the antivenoms required vary drastically across regions. Giving the wrong antivenom wastes precious, expensive vials and can cause severe anaphylactic reactions.

## 🚀 Our Solution: VENOM.AI
VENOM.AI is an intelligence platform designed to support frontline healthcare workers. It utilizes a **Late Fusion** multimodal AI architecture to fuse three distinct signals:
1. **Geographic Prior:** Where did the bite occur? This immediately filters the candidate species based on regional endemicity.
2. **Clinical Toxidrome:** What symptoms is the patient exhibiting? Real-time mapping against WHO guidelines to identify the clinical syndrome (e.g., progressive neurotoxicity, coagulopathy).
3. **Computer Vision:** (Optional) If an image of the snake is available, an `EfficientNet-B0` neural network identifies the species by analyzing scale morphology and color patterns.

These signals are fed into a **WHO-compliant Clinical Engine** powered by `Llama 3.1` (via Groq), which arbitrates conflicts (e.g., overriding vision if the species is not geographically native) and produces a definitive **Intelligence Report** with recommended antivenoms, severity triage, and immediate clinical directives.

## ✨ Key Features
- **Interactive Geographic Intelligence:** A custom-painted SVG map of Africa allowing rapid selection of the patient's region.
- **Dynamic Symptom Selection:** Fast toggles for critical symptoms with real-time severity computation.
- **Vision Inference:** Direct image upload utilizing an `EfficientNet-B0` model fine-tuned on 6 highly medically significant African snake species.
- **Explainable AI:** SHAP-weighted attribution showing how much the final diagnosis relied on Geography vs. Symptoms vs. Vision.
- **Premium Interface:** A modern, dark-mode, highly responsive glassmorphism UI built to impress.

## 🛠 Technology Stack
- **Frontend:** React, TanStack Start, Vite, Tailwind CSS, Framer Motion
- **Backend:** Python, FastAPI, Uvicorn
- **AI Models:** 
  - Vision: PyTorch (`EfficientNet-B0`)
  - Fusion/Clinical Engine: `Llama 3.1 8b-instant` via Groq API

## 🚦 Running the Application

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Groq API Key

### 2. Setup the Environment
Clone the repository, then configure your `.env` file at the root of the project:
```env
GROQ_API_KEY_1=your_groq_key_here
VITE_BACKEND_URL=http://localhost:8000
```

### 3. Start the Backend (Clinical Engine & Vision Model)
```bash
cd backend
pip install -r requirements.txt
python server.py
```
*The backend will run on `http://localhost:8000`.*

### 4. Start the Frontend
```bash
# In the root directory
npm install
npm run dev
```
*The web app will run on `http://localhost:8080`.*

---
**Disclaimer:** *VENOM.AI is developed for research and demonstration purposes during a hackathon. It is NOT a substitute for professional clinical judgment.*
