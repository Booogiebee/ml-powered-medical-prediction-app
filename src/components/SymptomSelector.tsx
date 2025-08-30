import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Activity, Thermometer, Brain, Heart, Zap } from "lucide-react";

export interface SymptomData {
  id: string;
  name: string;
  category: "general" | "respiratory" | "gastrointestinal" | "neurological" | "cardiovascular";
  severity: number;
  commonFor: string[];
}

export const AVAILABLE_SYMPTOMS: SymptomData[] = [
  // General symptoms
  { id: "fever", name: "Fever", category: "general", severity: 3, commonFor: ["malaria", "typhoid", "flu"] },
  { id: "fatigue", name: "Fatigue/Weakness", category: "general", severity: 2, commonFor: ["malaria", "typhoid", "flu", "anemia"] },
  { id: "chills", name: "Chills", category: "general", severity: 3, commonFor: ["malaria", "typhoid"] },
  { id: "sweating", name: "Excessive Sweating", category: "general", severity: 2, commonFor: ["malaria", "tuberculosis"] },
  { id: "weight_loss", name: "Unexplained Weight Loss", category: "general", severity: 3, commonFor: ["tuberculosis", "diabetes"] },
  
  // Respiratory
  { id: "cough", name: "Cough", category: "respiratory", severity: 2, commonFor: ["flu", "tuberculosis", "pneumonia"] },
  { id: "shortness_breath", name: "Shortness of Breath", category: "respiratory", severity: 3, commonFor: ["pneumonia", "asthma"] },
  { id: "chest_pain", name: "Chest Pain", category: "respiratory", severity: 3, commonFor: ["pneumonia", "heart_disease"] },
  { id: "runny_nose", name: "Runny/Stuffy Nose", category: "respiratory", severity: 1, commonFor: ["flu", "common_cold"] },
  
  // Gastrointestinal  
  { id: "nausea", name: "Nausea", category: "gastrointestinal", severity: 2, commonFor: ["malaria", "typhoid", "food_poisoning"] },
  { id: "vomiting", name: "Vomiting", category: "gastrointestinal", severity: 3, commonFor: ["malaria", "typhoid", "food_poisoning"] },
  { id: "diarrhea", name: "Diarrhea", category: "gastrointestinal", severity: 2, commonFor: ["typhoid", "food_poisoning"] },
  { id: "abdominal_pain", name: "Abdominal Pain", category: "gastrointestinal", severity: 2, commonFor: ["typhoid", "appendicitis"] },
  { id: "loss_appetite", name: "Loss of Appetite", category: "gastrointestinal", severity: 2, commonFor: ["typhoid", "hepatitis"] },
  
  // Neurological
  { id: "headache", name: "Headache", category: "neurological", severity: 2, commonFor: ["malaria", "typhoid", "flu", "migraine"] },
  { id: "confusion", name: "Confusion/Disorientation", category: "neurological", severity: 3, commonFor: ["malaria", "meningitis"] },
  { id: "seizures", name: "Seizures", category: "neurological", severity: 4, commonFor: ["malaria", "epilepsy"] },
  { id: "muscle_aches", name: "Muscle Aches", category: "neurological", severity: 2, commonFor: ["flu", "dengue"] },
  
  // Cardiovascular
  { id: "rapid_heart", name: "Rapid Heart Rate", category: "cardiovascular", severity: 3, commonFor: ["malaria", "heart_disease"] },
  { id: "low_blood_pressure", name: "Low Blood Pressure", category: "cardiovascular", severity: 3, commonFor: ["sepsis", "dehydration"] },
];

const categoryIcons = {
  general: Activity,
  respiratory: Zap,
  gastrointestinal: Heart,
  neurological: Brain,
  cardiovascular: Thermometer,
};

const categoryLabels = {
  general: "General Symptoms",
  respiratory: "Respiratory System", 
  gastrointestinal: "Gastrointestinal",
  neurological: "Neurological",
  cardiovascular: "Cardiovascular",
};

interface SymptomSelectorProps {
  selectedSymptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
}

export function SymptomSelector({ selectedSymptoms, onSymptomsChange }: SymptomSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["general", "respiratory"])
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSymptomToggle = (symptomId: string) => {
    if (selectedSymptoms.includes(symptomId)) {
      onSymptomsChange(selectedSymptoms.filter(id => id !== symptomId));
    } else {
      onSymptomsChange([...selectedSymptoms, symptomId]);
    }
  };

  const groupedSymptoms = AVAILABLE_SYMPTOMS.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = [];
    }
    acc[symptom.category].push(symptom);
    return acc;
  }, {} as Record<string, SymptomData[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Select Your Symptoms
        </CardTitle>
        <CardDescription>
          Choose all symptoms you are currently experiencing. Be as specific as possible for better diagnostic accuracy.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedSymptoms.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Selected Symptoms ({selectedSymptoms.length}):</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(symptomId => {
                const symptom = AVAILABLE_SYMPTOMS.find(s => s.id === symptomId);
                return symptom ? (
                  <Badge key={symptomId} variant="secondary" className="bg-primary/10 text-primary">
                    {symptom.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </div>
        )}

        {Object.entries(groupedSymptoms).map(([category, symptoms]) => {
          const Icon = categoryIcons[category as keyof typeof categoryIcons];
          const isExpanded = expandedCategories.has(category);
          
          return (
            <div key={category} className="border rounded-lg">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{categoryLabels[category as keyof typeof categoryLabels]}</span>
                  <Badge variant="outline" className="text-xs">
                    {symptoms.filter(s => selectedSymptoms.includes(s.id)).length}/{symptoms.length}
                  </Badge>
                </div>
                <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                  ▶
                </div>
              </button>
              
              {isExpanded && (
                <div className="p-3 pt-0 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {symptoms.map(symptom => (
                    <div
                      key={symptom.id}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/30 transition-colors"
                    >
                      <Checkbox
                        id={symptom.id}
                        checked={selectedSymptoms.includes(symptom.id)}
                        onCheckedChange={() => handleSymptomToggle(symptom.id)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={symptom.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {symptom.name}
                        {symptom.severity >= 3 && (
                          <span className="ml-1 text-warning text-xs">⚠</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}