import { AVAILABLE_SYMPTOMS, type SymptomData } from "@/components/SymptomSelector";

export interface DiagnosisResult {
  condition: string;
  probability: number;
  confidenceInterval: [number, number];
  description: string;
  commonSymptoms: string[];
  recommendedActions: string[];
  severity: "low" | "medium" | "high" | "critical";
}

export interface PatientData {
  age?: number;
  gender?: "male" | "female" | "other";
  symptoms: string[];
  duration?: string;
  severity?: "mild" | "moderate" | "severe";
}

// Disease knowledge base with symptom patterns
const DISEASE_PATTERNS = {
  malaria: {
    name: "Malaria",
    description: "A parasitic infection transmitted by infected mosquitoes",
    keySymptoms: ["fever", "chills", "headache", "muscle_aches", "fatigue", "nausea", "vomiting"],
    severity: "high",
    baseRate: 0.15,
    symptoms: {
      fever: 0.95,
      chills: 0.85,
      headache: 0.80,
      muscle_aches: 0.75,
      fatigue: 0.85,
      nausea: 0.70,
      vomiting: 0.60,
      sweating: 0.65,
      confusion: 0.40,
      rapid_heart: 0.45
    },
    recommendedActions: [
      "Seek immediate medical attention",
      "Blood test for malaria parasites",
      "Start antimalarial treatment if confirmed",
      "Monitor for complications"
    ]
  },
  typhoid: {
    name: "Typhoid Fever",
    description: "A bacterial infection caused by Salmonella typhi",
    keySymptoms: ["fever", "headache", "abdominal_pain", "diarrhea", "loss_appetite", "fatigue"],
    severity: "high",
    baseRate: 0.12,
    symptoms: {
      fever: 0.90,
      headache: 0.85,
      abdominal_pain: 0.80,
      diarrhea: 0.75,
      loss_appetite: 0.85,
      fatigue: 0.80,
      nausea: 0.70,
      vomiting: 0.55,
      chills: 0.50,
      weight_loss: 0.60
    },
    recommendedActions: [
      "Immediate medical consultation required",
      "Blood culture and Widal test",
      "Start appropriate antibiotic treatment",
      "Maintain hydration and rest"
    ]
  },
  flu: {
    name: "Influenza (Flu)",
    description: "A viral respiratory infection",
    keySymptoms: ["fever", "cough", "headache", "muscle_aches", "fatigue", "runny_nose"],
    severity: "medium",
    baseRate: 0.25,
    symptoms: {
      fever: 0.85,
      cough: 0.90,
      headache: 0.80,
      muscle_aches: 0.85,
      fatigue: 0.90,
      runny_nose: 0.70,
      chills: 0.60,
      nausea: 0.30,
      chest_pain: 0.25,
      shortness_breath: 0.15
    },
    recommendedActions: [
      "Rest and increase fluid intake",
      "Over-the-counter pain relievers",
      "Monitor symptoms for worsening",
      "Seek medical care if symptoms persist"
    ]
  },
  pneumonia: {
    name: "Pneumonia",
    description: "Infection that inflames air sacs in lungs",
    keySymptoms: ["cough", "fever", "chest_pain", "shortness_breath", "fatigue"],
    severity: "high",
    baseRate: 0.08,
    symptoms: {
      cough: 0.95,
      fever: 0.85,
      chest_pain: 0.80,
      shortness_breath: 0.90,
      fatigue: 0.75,
      chills: 0.70,
      headache: 0.45,
      muscle_aches: 0.50,
      nausea: 0.30
    },
    recommendedActions: [
      "Immediate medical attention required",
      "Chest X-ray and blood tests",
      "Antibiotic or antiviral treatment",
      "Hospitalization may be necessary"
    ]
  },
  food_poisoning: {
    name: "Food Poisoning",
    description: "Illness caused by consuming contaminated food",
    keySymptoms: ["nausea", "vomiting", "diarrhea", "abdominal_pain", "fever"],
    severity: "medium",
    baseRate: 0.18,
    symptoms: {
      nausea: 0.95,
      vomiting: 0.90,
      diarrhea: 0.85,
      abdominal_pain: 0.90,
      fever: 0.60,
      fatigue: 0.70,
      headache: 0.40,
      chills: 0.35,
      muscle_aches: 0.30
    },
    recommendedActions: [
      "Stay hydrated with clear fluids",
      "Rest and avoid solid foods initially",
      "Seek medical care if severe symptoms",
      "Monitor for signs of dehydration"
    ]
  },
  common_cold: {
    name: "Common Cold",
    description: "Viral infection of the upper respiratory tract",
    keySymptoms: ["runny_nose", "cough", "headache", "fatigue"],
    severity: "low",
    baseRate: 0.35,
    symptoms: {
      runny_nose: 0.95,
      cough: 0.70,
      headache: 0.60,
      fatigue: 0.65,
      muscle_aches: 0.40,
      fever: 0.25,
      chest_pain: 0.15,
      nausea: 0.10
    },
    recommendedActions: [
      "Rest and stay hydrated",
      "Use saline nasal drops",
      "Over-the-counter symptom relief",
      "Usually resolves in 7-10 days"
    ]
  }
};

/**
 * Calculate Bayesian probability for each disease given symptoms
 */
function calculateBayesianProbability(
  patientSymptoms: string[],
  diseaseKey: string,
  diseaseData: typeof DISEASE_PATTERNS[keyof typeof DISEASE_PATTERNS]
): number {
  const priorProbability = diseaseData.baseRate;
  
  // Calculate symptom matching score
  const keySymptoms = diseaseData.keySymptoms;
  const allSymptoms = Object.keys(diseaseData.symptoms);
  
  // Count matching symptoms with weighted importance
  let matchScore = 0;
  let totalWeight = 0;
  
  // Weight key symptoms more heavily
  for (const symptom of keySymptoms) {
    const weight = 2.0; // Key symptoms are more important
    totalWeight += weight;
    
    if (patientSymptoms.includes(symptom)) {
      const symptomProb = diseaseData.symptoms[symptom as keyof typeof diseaseData.symptoms] || 0.5;
      matchScore += weight * symptomProb;
    }
  }
  
  // Add other symptoms with lower weight
  for (const symptom of allSymptoms) {
    if (!keySymptoms.includes(symptom)) {
      const weight = 0.5; // Non-key symptoms have lower weight
      totalWeight += weight;
      
      if (patientSymptoms.includes(symptom)) {
        const symptomProb = diseaseData.symptoms[symptom as keyof typeof diseaseData.symptoms] || 0.3;
        matchScore += weight * symptomProb;
      }
    }
  }
  
  // Calculate normalized match ratio
  const matchRatio = totalWeight > 0 ? matchScore / totalWeight : 0;
  
  // Combine with prior probability using weighted average
  const probability = (matchRatio * 0.7) + (priorProbability * 0.3);
  
  return Math.min(probability, 1.0);
}

/**
 * Calculate confidence interval based on symptom match quality
 */
function calculateConfidenceInterval(
  probability: number,
  patientSymptoms: string[],
  diseaseSymptoms: string[]
): [number, number] {
  const symptomMatch = patientSymptoms.filter(s => diseaseSymptoms.includes(s)).length;
  const totalRelevantSymptoms = diseaseSymptoms.length;
  
  // Higher match rate = narrower confidence interval
  const matchRatio = symptomMatch / Math.max(totalRelevantSymptoms, 1);
  const uncertainty = 0.15 * (1 - matchRatio); // Max 15% uncertainty
  
  const lower = Math.max(0, probability - uncertainty);
  const upper = Math.min(1, probability + uncertainty);
  
  return [Math.round(lower * 100) / 100, Math.round(upper * 100) / 100];
}

/**
 * Generate diagnosis predictions based on patient symptoms
 */
export async function generateDiagnosis(patientData: PatientData): Promise<DiagnosisResult[]> {
  // Simulate ML processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const results: DiagnosisResult[] = [];
  
  // Calculate probability for each disease
  for (const [diseaseKey, diseaseData] of Object.entries(DISEASE_PATTERNS)) {
    const probability = calculateBayesianProbability(
      patientData.symptoms,
      diseaseKey,
      diseaseData
    );
    
    // Only include diseases with reasonable probability
    if (probability > 0.05) {
      const confidenceInterval = calculateConfidenceInterval(
        probability,
        patientData.symptoms,
        diseaseData.keySymptoms
      );
      
      results.push({
        condition: diseaseData.name,
        probability: Math.round(probability * 100) / 100,
        confidenceInterval,
        description: diseaseData.description,
        commonSymptoms: diseaseData.keySymptoms,
        recommendedActions: diseaseData.recommendedActions,
        severity: diseaseData.severity as "low" | "medium" | "high" | "critical"
      });
    }
  }
  
  // Sort by probability (highest first)
  results.sort((a, b) => b.probability - a.probability);
  
  // Normalize probabilities so they sum to reasonable total
  const totalProb = results.reduce((sum, result) => sum + result.probability, 0);
  if (totalProb > 1.0) {
    results.forEach(result => {
      result.probability = Math.round((result.probability / totalProb) * 100) / 100;
    });
  }
  
  return results.slice(0, 5); // Return top 5 results
}

/**
 * Get symptom information by ID
 */
export function getSymptomInfo(symptomId: string): SymptomData | undefined {
  return AVAILABLE_SYMPTOMS.find(symptom => symptom.id === symptomId);
}

/**
 * Validate patient data
 */
export function validatePatientData(data: PatientData): string[] {
  const errors: string[] = [];
  
  if (!data.symptoms || data.symptoms.length === 0) {
    errors.push("Please select at least one symptom");
  }
  
  if (data.symptoms && data.symptoms.length > 15) {
    errors.push("Please select no more than 15 symptoms for better accuracy");
  }
  
  if (data.age && (data.age < 0 || data.age > 120)) {
    errors.push("Please enter a valid age");
  }
  
  return errors;
}