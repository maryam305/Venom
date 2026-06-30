# 🐍 VENOM.AI — Multimodal Snakebite Intelligence

> An AI-powered clinical decision-support platform fusing geography, symptoms, and computer vision to combat snakebite envenomation in Sub-Saharan Africa.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)
[![Built with React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)](#-technology-stack)
[![Backend FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](#-technology-stack)
[![Model Llama 3.1](https://img.shields.io/badge/LLM-Llama%203.1%20(Groq)-purple)](#-technology-stack)

<p align="center">
  <img src="https://github.com/user-attachments/assets/25ceb34d-de06-44ca-98be-31bd80144036" alt="VENOM.AI landing screen" width="850">
</p>

VENOM.AI greets the user with a clean, dark-mode command center summarizing the three intelligence pillars the platform fuses for every assessment: Computer Vision, Clinical Symptoms, and Geographic Intel.

---

## 📑 Table of Contents
- [The Problem](#-the-problem)
- [Our Solution](#-our-solution-venomai)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Running the Application](#-running-the-application)
  - [Prerequisites](#1-prerequisites)
  - [Environment Setup](#2-setup-the-environment)
  - [Backend](#3-start-the-backend-clinical-engine--vision-model)
  - [Frontend](#4-start-the-frontend)
- [Disclaimer](#️-disclaimer)
- [License](#-license)

---

## 🌍 The Problem
Snakebite envenomation is a neglected tropical disease that causes over 100,000 deaths and 400,000 amputations globally every year, with a massive burden in Sub-Saharan Africa. When a patient arrives at a rural clinic with a snakebite, medical staff face extreme challenges:

1. **Misidentification** — Knowing the exact species of snake is crucial, but victims often bring no snake or a mangled specimen.
2. **Clinical Uncertainty** — Symptoms can take hours to manifest, and distinguishing between cytotoxic, hemotoxic, and neurotoxic syndromes requires specialized knowledge.
3. **Geographic Variation** — Snake species and the antivenoms required vary drastically across regions. Giving the wrong antivenom wastes precious, expensive vials and can cause severe anaphylactic reactions.

## 🚀 Our Solution: VENOM.AI
VENOM.AI is an intelligence platform designed to support frontline healthcare workers. It uses a **Late Fusion** multimodal AI architecture to combine three distinct signals: geography, clinical toxidrome, and computer vision. Here is what that workflow looks like in practice.

### Step 1 — Geographic Prior
The clinician starts by marking where the bite occurred on an interactive map. This immediately filters candidate species based on regional endemicity, before any symptoms are even entered.

<p align="center">
  <img src="https://github.com/user-attachments/assets/0f8438f5-979c-4c20-a872-99e375680439" alt="Interactive Africa map for region selection" width="850">
</p>

Selecting a region surfaces an immediate risk snapshot — bite frequency, severity index, dominant biome, and the most common venomous species reported in that area.

<p align="center">
  <img src="https://github.com/user-attachments/assets/16c36c22-6db7-4af9-8ee4-2e41e7f28c31" alt="Sudan region risk profile and species probability" width="850">
</p>

### Step 2 — Clinical Toxidrome
Next, the clinician toggles the symptoms the patient is presenting. Real-time mapping against WHO guidelines identifies the clinical syndrome — for example progressive neurotoxicity or coagulopathy — and updates severity as more symptoms are added.

<p align="center">
  <img src="https://github.com/user-attachments/assets/e232e0eb-2418-4ee2-a93c-1229249b1888" alt="Dynamic symptom selection grid" width="850">
</p>

### Step 3 — Computer Vision *(optional)*
If a photo of the snake is available, it can be dropped directly into the vision module. An `EfficientNet-B0` neural network analyzes scale morphology and color patterns across 6 medically significant African species.

<p align="center">
  <img src="https://github.com/user-attachments/assets/68be789e-38fb-4ced-80d7-18586c9f199f" alt="Snake image upload and vision analysis" width="850">
</p>

The model returns a species prediction with a confidence score and risk classification — here correctly identifying a Black Mamba with very high confidence.

<p align="center">
  <img src="https://github.com/user-attachments/assets/ecbff9f7-531f-4760-8466-1fe74eaf870b" alt="Species identified as Black Mamba" width="850">
</p>

### Step 4 — Fusion & Clinical Report
All three signals — geography, symptoms, and vision — are passed to a **WHO-compliant Clinical Engine** powered by `Llama 3.1` (via Groq). The engine arbitrates conflicts, such as overriding a vision result if that species isn't geographically native, and produces a definitive diagnosis with severity triage and recommended antivenom.

<p align="center">
  <img src="https://github.com/user-attachments/assets/d156216d-d928-4687-bf7b-548771664dbc" alt="Fusion Result report - Black Mamba prediction with severity index" width="850">
</p>

The final report also includes immediate clinical directives, hard contraindications, and an explainable AI breakdown showing exactly how much each signal — geography, symptoms, vision — contributed to the diagnosis.

<p align="center">
  <img src="https://github.com/user-attachments/assets/e6515139-c263-46ef-9197-1cb566efc4c2" alt="Clinical directives, contraindications, and feature attribution" width="850">
</p>

## ✨ Key Features
- 🗺️ **Interactive Geographic Intelligence** — A custom-painted SVG map of Africa for rapid selection of the patient's region.
- 🩺 **Dynamic Symptom Selection** — Fast toggles for critical symptoms with real-time severity computation.
- 📸 **Vision Inference** — Direct image upload using an `EfficientNet-B0` model fine-tuned on 6 medically significant African snake species.
- 🔍 **Explainable AI** — SHAP-weighted attribution showing how much the final diagnosis relied on Geography vs. Symptoms vs. Vision.
- 💎 **Premium Interface** — A modern, dark-mode, highly responsive glassmorphism UI.

## 🛠 Technology Stack
| Layer | Tools |
|---|---|
| **Frontend** | React, TanStack Start, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Python, FastAPI, Uvicorn |
| **Vision Model** | PyTorch (`EfficientNet-B0`) |
| **Fusion / Clinical Engine** | `Llama 3.1 8b-instant` via Groq API |

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

## ⚠️ Disclaimer
*VENOM.AI is developed for research and demonstration purposes during a hackathon. It is **NOT** a substitute for professional clinical judgment.*

## 📜 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2026 [Venom]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📧 Contact

**Project Contributor**: Maryam Moustafa
- Email: maryam23shabaan@gmail.com
- [GitHub](https://github.com/maryam305)
- [LinkedIn](https://www.linkedin.com/in/maryam-moustafa-653257378)
- 
**Project Contributor**: Aya Sayed
- Email: aya.sayed14827@gmail.com
- [GitHub](https://github.com/14930)
- [LinkedIn](https://www.linkedin.com/in/aya-sayed-bb6a80397)
  
**Project Contributor**: Janna Waleed 
- Email :janawaleed135@gmail.com
- [GitHub](https://github.com/janawaleed135)
- [LinkedIn]([https://linkedin.com/in/nn-anwar](https://www.linkedin.com/in/jana-waleed-007704381)


