import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function MedicalDisclaimer() {
  return (
    <Alert className="border-warning bg-warning/5 mb-6">
      <AlertTriangle className="h-4 w-4 text-warning" />
      <AlertTitle className="text-warning">Important Medical Disclaimer</AlertTitle>
      <AlertDescription className="text-sm">
        <strong>This AI diagnostic tool is for educational and informational purposes only.</strong>
        <br />
        It is not intended to replace professional medical advice, diagnosis, or treatment. 
        Always consult with qualified healthcare professionals for any medical concerns. 
        In case of emergency, contact your local emergency services immediately.
      </AlertDescription>
    </Alert>
  );
}