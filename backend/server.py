"""
VENOM.AI — Backend API Server
Serves two model endpoints:
  1. /api/classify  — EfficientNet-B0 snake species classification
  2. /api/diagnose  — WHO-compliant Late Fusion Clinical Engine (Groq/Llama 3)
"""

import os
import sys
import json
import io
import base64
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image

# ─── Load env ────────────────────────────────────────────────────────────────
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

# ─── FastAPI app ─────────────────────────────────────────────────────────────
app = FastAPI(title="VENOM.AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Constants ───────────────────────────────────────────────────────────────
CLASS_NAMES = [
    "Bitis_arietans",
    "Bitis_gabonica",
    "Dendroaspis_polylepis",
    "Dispholidus_typus",
    "Echis_ocellatus",
    "Naja_nigricollis",
]

VENOM_REFERENCE = {
    "Bitis_arietans": {
        "common_name": "Puff Adder",
        "fang_type": "Solenoglyphous (front, hinged, hollow)",
        "venom_risk": "High",
        "venom_action": "Cytotoxic / tissue-damaging",
        "clinical_note": "Responsible for high fatality counts; causes severe local swelling and tissue necrosis."
    },
    "Echis_ocellatus": {
        "common_name": "West African Carpet Viper",
        "fang_type": "Solenoglyphous (front, hinged, hollow)",
        "venom_risk": "High",
        "venom_action": "Haemotoxic / anticoagulant",
        "clinical_note": "A primary source of severe systemic hemorrhage and coagulopathy across West Africa."
    },
    "Bitis_gabonica": {
        "common_name": "Gaboon Viper",
        "fang_type": "Solenoglyphous (front, hinged, hollow)",
        "venom_risk": "High",
        "venom_action": "Cytotoxic and haemotoxic",
        "clinical_note": "Possesses the longest fangs of any venomous snake species along with large venom yields."
    },
    "Dendroaspis_polylepis": {
        "common_name": "Black Mamba",
        "fang_type": "Proteroglyphous (front, fixed)",
        "venom_risk": "Very high",
        "venom_action": "Neurotoxic",
        "clinical_note": "Rapidly causes neuromuscular blockages; demands rapid antivenom therapeutic deployment."
    },
    "Naja_nigricollis": {
        "common_name": "Black-necked Spitting Cobra",
        "fang_type": "Proteroglyphous (front, fixed)",
        "venom_risk": "High",
        "venom_action": "Cytotoxic; capable of defensive airborne venom projection",
        "clinical_note": "Ocular exposure induces rapid chemical conjunctivitis and requires immediate irrigation."
    },
    "Dispholidus_typus": {
        "common_name": "Boomslang",
        "fang_type": "Opisthoglyphous (rear, grooved)",
        "venom_risk": "High",
        "venom_action": "Haemotoxic (Slow-acting)",
        "clinical_note": "Symptom presentation can be delayed for hours, creating a risk of hidden internal bleeding."
    }
}

# ─── Vision Model Loading ────────────────────────────────────────────────────
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "african_snake_efficientnet.pth"

vision_model = None


def load_vision_model():
    """Load the EfficientNet-B0 model from the saved checkpoint."""
    global vision_model
    if vision_model is not None:
        return vision_model

    if not MODEL_PATH.exists():
        print(f"[WARNING] Model file not found at {MODEL_PATH}. Vision endpoint will use fallback.")
        return None

    try:
        model = models.efficientnet_b0(weights=None)
        num_features = model.classifier[1].in_features
        model.classifier[1] = nn.Linear(num_features, len(CLASS_NAMES))
        model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
        model = model.to(DEVICE)
        model.eval()
        vision_model = model
        print(f"[OK] Vision model loaded successfully on {DEVICE}")
        return vision_model
    except Exception as e:
        print(f"[ERROR] Failed to load vision model: {e}")
        return None


# Pre-processing pipeline matching training transforms
eval_transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])


# ─── Request/Response Models ─────────────────────────────────────────────────
class ClassifyResponse(BaseModel):
    status: str
    species_scientific: str
    common_name: str
    confidence: float
    venom_risk: str
    venom_action: str
    clinical_note: str
    fang_type: str


class DiagnoseRequest(BaseModel):
    geographic_context: str
    clinical_presentation: List[str]
    vision_inference_signal: Optional[str] = "None"


class DiagnoseResponse(BaseModel):
    final_suspected_species: str
    clinical_syndrome_identified: str
    clinical_confidence_score: str
    recommended_antivenom: str
    immediate_clinical_directives: List[str]
    contraindications: List[str]
    error: Optional[str] = None


# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "model_loaded": vision_model is not None}


@app.post("/api/classify", response_model=ClassifyResponse)
async def classify_snake(file: UploadFile = File(...)):
    """
    Accepts an uploaded snake image and returns species classification
    with clinical metadata from the EfficientNet-B0 model.
    """
    model = load_vision_model()

    if model is None:
        raise HTTPException(status_code=503, detail="Vision model not available. Check model file.")

    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        tensor = eval_transform(img).unsqueeze(0).to(DEVICE)

        with torch.no_grad():
            logits = model(tensor)
            probs = F.softmax(logits, dim=1)
            conf, class_idx = torch.max(probs, 1)

        predicted_class = CLASS_NAMES[class_idx.item()]
        clinical_meta = VENOM_REFERENCE.get(predicted_class, {
            "common_name": "Unknown",
            "fang_type": "N/A",
            "venom_risk": "N/A",
            "venom_action": "N/A",
            "clinical_note": "No match found."
        })

        return ClassifyResponse(
            status="Inference Executed",
            species_scientific=predicted_class.replace("_", " "),
            common_name=clinical_meta["common_name"],
            confidence=round(conf.item(), 4),
            venom_risk=clinical_meta["venom_risk"],
            venom_action=clinical_meta["venom_action"],
            clinical_note=clinical_meta["clinical_note"],
            fang_type=clinical_meta["fang_type"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Classification failed: {str(e)}")


@app.post("/api/diagnose", response_model=DiagnoseResponse)
async def diagnose(payload: DiagnoseRequest):
    """
    Runs the WHO-compliant Late Fusion Clinical Engine using Groq/Llama 3.
    Combines geographic, clinical, and vision signals into a unified diagnosis.
    """
    try:
        from groq import Groq
    except ImportError:
        raise HTTPException(status_code=503, detail="Groq SDK not installed.")

    # Gather API keys
    api_keys = [
        os.getenv("GROQ_API_KEY_1"),
        os.getenv("GROQ_API_KEY_2"),
        os.getenv("GROQ_API_KEY_3"),
    ]
    valid_keys = [k for k in api_keys if k]

    if not valid_keys:
        # Return a meaningful fallback response
        return DiagnoseResponse(
            error="No API keys configured. Add GROQ_API_KEY_1 to .env file.",
            final_suspected_species="Unknown - Awaiting Configuration",
            clinical_syndrome_identified="System Offline",
            clinical_confidence_score="0%",
            recommended_antivenom="Configure API keys to enable diagnosis.",
            immediate_clinical_directives=["Monitor vital signs manually", "Keep patient calm and immobile"],
            contraindications=["Do not intervene blindly. Wait for senior medical staff."],
        )

    system_prompt = """You are an expert clinical decision engine for African Snakebite Envenomation.
Your logic is strictly governed by the official WHO 'Guidelines for the prevention and clinical management of snakebite in Africa'.
You must reconcile Geographic Location, Symptom Array, and Vision Inference into ONE diagnostic and intervention package.

# WHO SYNDROMIC MANAGEMENT RULES
You must map the symptoms to one of the following 6 African clinical syndromes:

1. SYNDROME 1: Marked local swelling with coagulable blood (Cytotoxic).
   - Symptoms: Painful, rapidly progressive swelling, blistering, necrosis. No spontaneous bleeding.
   - Example Species: Spitting Cobras (Naja spp.), Puff Adders (Bitis arietans).
   - Contraindications: STRICTLY NO pressure immobilization bandages (PIB). NO tourniquets.

2. SYNDROME 2: Marked local swelling with incoagulable blood and/or spontaneous systemic bleeding (Hemotoxic/Cytotoxic).
   - Symptoms: Extensive swelling, bleeding from gums/wounds, incoagulable blood.
   - Example Species: Saw-scaled vipers (Echis spp.), Desert horned-vipers.
   - Directives: Perform 20-minute Whole Blood Clotting Test (20WBCT).
   - Contraindications: STRICTLY NO pressure immobilization. AVOID intramuscular injections.

3. SYNDROME 3: Progressive paralysis (neurotoxicity) with mild/negligible swelling.
   - Symptoms: Ptosis (drooping eyelids), diplopia, flaccid muscle paralysis, respiratory distress.
   - Example Species: Mambas (Dendroaspis spp.), Non-spitting Cobras.
   - Directives: Prepare for immediate intubation and mechanical ventilation.

4. SYNDROME 4: Mild swelling alone.
   - Symptoms: Mild local swelling involving less than half the bitten limb, absent systemic symptoms.
   - Example Species: Night adders (Causus spp.), Burrowing asps.

5. SYNDROME 5: Mild or negligible local swelling with incoagulable blood (Hemotoxic).
   - Symptoms: Systemic bleeding, incoagulable blood, very little swelling.
   - Example Species: Boomslang (Dispholidus typus).
   - Contraindications: AVOID intramuscular injections.

6. SYNDROME 6: Moderate to marked local swelling associated with neurotoxicity.
   - Symptoms: Local swelling combined with ptosis, ophthalmoplegia, or dysphagia.
   - Example Species: Berg adder (Bitis atropos).

# LATE FUSION LOGIC RULES
- If Vision Inference is 'None' or below 70% confidence, compute the diagnosis entirely from Geography + Symptoms based on the WHO syndromes above.
- If Vision Inference contradicts Geography, completely override the vision signal and state: "Discrepancy: Species not endemic to region. Relying on syndromic management."

Output exactly ONE valid raw JSON structure. Do not include markdown formatting or conversational text. 
The JSON must contain exactly these keys: 
'final_suspected_species' (string),
'clinical_syndrome_identified' (string, use the exact name from the 6 above), 
'clinical_confidence_score' (string/percentage), 
'recommended_antivenom' (string), 
'immediate_clinical_directives' (array of strings), 
'contraindications' (array of strings - MUST include warnings based on the syndrome rules above).
# CLINICAL CONFIDENCE SCORE CALCULATION RULES:
- NEVER return 100% confidence unless there is a definitive, high-confidence vision match AND identical symptom/geography alignment.
- If Vision Inference is 'None' or unavailable, the maximum 'clinical_confidence_score' you can return is 75% to 85% (State it as a range or a calculated value, e.g., '80% based on Syndromic presentation only'). This reflects that the diagnosis is purely syndromic and definitive species isolation is impossible without visual or laboratory confirmation."""

    user_content = f"""
    Please analyze the following multi-signal clinical payload:
    Geographic Context: {payload.geographic_context}
    Clinical Presentation: {payload.clinical_presentation}
    Vision Inference Signal: {payload.vision_inference_signal}
    """

    for idx, key in enumerate(valid_keys):
        try:
            client = Groq(api_key=key)
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            result = json.loads(response.choices[0].message.content)
            return DiagnoseResponse(**result)
        except Exception as e:
            error_msg = str(e).lower()
            if "429" in error_msg or "rate limit" in error_msg or "quota" in error_msg:
                print(f"[System Notice] Key {idx + 1} reached quota. Rerouting...")
                continue
            else:
                return DiagnoseResponse(
                    error=f"Engine error: {str(e)}",
                    final_suspected_species="Unknown - Awaiting Medical Evaluation",
                    clinical_syndrome_identified="Awaiting Evaluation",
                    clinical_confidence_score="0%",
                    recommended_antivenom="Seek immediate standard clinical stabilization",
                    immediate_clinical_directives=["Monitor vital signs manually", "Keep patient calm and immobile"],
                    contraindications=["Do not intervene blindly. Wait for senior medical staff."],
                )

    return DiagnoseResponse(
        error="CRITICAL: All API keys exhausted.",
        final_suspected_species="Unknown",
        clinical_syndrome_identified="System Offline",
        clinical_confidence_score="0%",
        recommended_antivenom="Emergency protocol only.",
        immediate_clinical_directives=["Contact emergency services immediately.", "Initiate basic life support if necessary."],
        contraindications=[],
    )


@app.on_event("startup")
async def startup():
    """Pre-load vision model on server start."""
    load_vision_model()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
