import os
import json
from dotenv import load_dotenv
from groq import Groq

# 1. Securely load API keys from the local environment
load_dotenv()

# 2. Establish the Fallback Key System to prevent Hackathon Quota crashes
API_KEYS = [
    os.getenv("GROQ_API_KEY_1"),
    os.getenv("GROQ_API_KEY_2"),
    os.getenv("GROQ_API_KEY_3")
]
VALID_KEYS = [key for key in API_KEYS if key is not None]

def run_late_fusion_engine(fusion_payload):
    """
    Ingests multi-signal data from the UI (Member 3) and applies WHO-compliant
    Late Fusion logic using Llama 3 to output a definitive clinical JSON directive.
    """
    
    # 3. The Professional WHO-Compliant System Prompt
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

    # 4. Construct the Payload
    user_content = f"""
    Please analyze the following multi-signal clinical payload:
    Geographic Context: {fusion_payload.get('geographic_context')}
    Clinical Presentation: {fusion_payload.get('clinical_presentation')}
    Vision Inference Signal: {fusion_payload.get('vision_inference_signal')}
    """

    # 5. Execute API Call with Built-in Redundancy
    for idx, key in enumerate(VALID_KEYS):
        try:
            client = Groq(api_key=key)
            
            # Utilizing the current 2026 high-speed versatile model
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.1, # Enforces strict adherence to WHO guidelines, preventing hallucination
                response_format={"type": "json_object"} 
            )
            
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            error_message = str(e).lower()
            if "429" in error_message or "rate limit" in error_message or "quota" in error_message:
                print(f"[System Notice] Key {idx + 1} reached quota. Rerouting to backup key...")
                continue
            else:
                return {
                    "error": f"System execution error: {str(e)}",
                    "final_suspected_species": "Unknown - Awaiting Medical Evaluation",
                    "clinical_syndrome_identified": "Awaiting Evaluation",
                    "clinical_confidence_score": "0%",
                    "recommended_antivenom": "Seek immediate standard clinical stabilization",
                    "immediate_clinical_directives": ["Monitor vital signs manually", "Keep patient calm and immobile"],
                    "contraindications": ["Do not intervene blindly. Wait for senior medical staff."]
                }
    
    return {
        "error": "CRITICAL: Fallback key system exhausted.",
        "final_suspected_species": "Unknown",
        "clinical_syndrome_identified": "System Offline",
        "clinical_confidence_score": "0%",
        "recommended_antivenom": "Emergency protocol only.",
        "immediate_clinical_directives": ["Contact emergency services immediately.", "Initiate basic life support if necessary."],
        "contraindications": []
    }

# ==========================================
# TEST CASE: Independent Smoke Test
# ==========================================
if __name__ == "__main__":
    if not VALID_KEYS:
        print("Configuration Error: No API keys found in the .env file.")
    else:
        # Mocking Member 3's UI payload for a Neurotoxic scenario without a photo
        mock_ui_payload = {
            "geographic_context": "Kenya",
            "clinical_presentation": ["Ptosis (drooping eyelids)", "Difficulty swallowing", "Flaccid muscle paralysis"],
            "vision_inference_signal": "None"
        }
        
        print("Executing Member 2 Late Fusion Engine (WHO Syndromic Test)...")
        result = run_late_fusion_engine(mock_ui_payload)
        print(json.dumps(result, indent=4))