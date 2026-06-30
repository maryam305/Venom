# 🐍 VENOM.AI — Multimodal Snakebite Intelligence

> An AI-powered clinical decision-support platform fusing geography, symptoms, and computer vision to combat snakebite envenomation in Sub-Saharan Africa.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#-license)
[![Built with React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)](#-technology-stack)
[![Backend FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](#-technology-stack)
[![Model Llama 3.1](https://img.shields.io/badge/LLM-Llama%203.1%20(Groq)-purple)](#-technology-stack)

| ![](https://github.com/user-attachments/assets/25ceb34d-de06-44ca-98be-31bd80144036) | ![](https://github.com/user-attachments/assets/0f8438f5-979c-4c20-a872-99e375680439) | ![](https://github.com/user-attachments/assets/16c36c22-6db7-4af9-8ee4-2e41e7f28c31) |
| :---: | :---: | :---: |
| ![](https://github.com/user-attachments/assets/e232e0eb-2418-4ee2-a93c-1229249b1888) | ![](https://github.com/user-attachments/assets/68be789e-38fb-4ced-80d7-18586c9f199f) | ![](https://github.com/user-attachments/assets/ecbff9f7-531f-4760-8466-1fe74eaf870b) |

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
VENOM.AI is an intelligence platform designed to support frontline healthcare workers. It uses a **Late Fusion** multimodal AI architecture to combine three distinct signals:

1. **Geographic Prior** — Where did the bite occur? This immediately filters candidate species based on regional endemicity.
2. **Clinical Toxidrome** — What symptoms is the patient exhibiting? Real-time mapping against WHO guidelines identifies the clinical syndrome (e.g., progressive neurotoxicity, coagulopathy).
3. **Computer Vision** *(optional)* — If an image of the snake is available, an `EfficientNet-B0` neural network identifies the species by analyzing scale morphology and color patterns.

These signals feed into a **WHO-compliant Clinical Engine** powered by `Llama 3.1` (via Groq), which arbitrates conflicts (e.g., overriding vision if the species isn't geographically native) and produces a definitive **Intelligence Report** with recommended antivenoms, severity triage, and immediate clinical directives.

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
