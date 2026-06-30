/**
 * VENOM.AI — API Client
 * Connects the frontend UI to the Python backend serving
 * the EfficientNet-B0 vision model and WHO-compliant clinical engine.
 */

const BACKEND_URL = (import.meta as any).env?.VITE_BACKEND_URL ?? "http://localhost:8000";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ClassifyResult {
  status: string;
  species_scientific: string;
  common_name: string;
  confidence: number;
  venom_risk: string;
  venom_action: string;
  clinical_note: string;
  fang_type: string;
}

export interface DiagnosePayload {
  geographic_context: string;
  clinical_presentation: string[];
  vision_inference_signal: string;
}

export interface DiagnoseResult {
  final_suspected_species: string;
  clinical_syndrome_identified: string;
  clinical_confidence_score: string;
  recommended_antivenom: string;
  immediate_clinical_directives: string[];
  contraindications: string[];
  error?: string;
}

// ─── API Functions ──────────────────────────────────────────────────────────

/**
 * Classify a snake image using the EfficientNet-B0 model.
 * Sends the image file to the backend /api/classify endpoint.
 */
export async function classifySnakeImage(file: File): Promise<ClassifyResult> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BACKEND_URL}/api/classify`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Classification failed: ${error}`);
  }

  return res.json();
}

/**
 * Run the WHO-compliant Late Fusion Clinical Engine.
 * Sends geographic, clinical, and vision signals for diagnosis.
 */
export async function runDiagnosis(payload: DiagnosePayload): Promise<DiagnoseResult> {
  const res = await fetch(`${BACKEND_URL}/api/diagnose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Diagnosis failed: ${error}`);
  }

  return res.json();
}

/**
 * Check backend health status.
 */
export async function checkHealth(): Promise<{ status: string; model_loaded: boolean }> {
  const res = await fetch(`${BACKEND_URL}/api/health`);
  return res.json();
}
