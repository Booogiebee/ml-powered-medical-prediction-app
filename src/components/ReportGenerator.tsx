import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import type { DiagnosisResult } from "@/services/diagnosisService";
import type { PatientInfoData } from "./PatientInfo";

interface ReportGeneratorProps {
  results: DiagnosisResult[];
  selectedSymptoms: string[];
  patientInfo: PatientInfoData;
  onGenerateReport: () => void;
}

export function ReportGenerator({ 
  results, 
  selectedSymptoms, 
  patientInfo, 
  onGenerateReport 
}: ReportGeneratorProps) {
  const generatePDFReport = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      // Header
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("MedGuard AI Diagnostic Report", margin, yPosition);
      yPosition += 15;

      // Date and disclaimer
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 20;

      // Medical disclaimer box
      doc.setDrawColor(255, 165, 0); // Orange border
      doc.setFillColor(255, 248, 220); // Light orange background
      doc.rect(margin, yPosition, pageWidth - 2 * margin, 25, "FD");
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("⚠ MEDICAL DISCLAIMER", margin + 5, yPosition + 8);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const disclaimerText = "This AI diagnostic tool is for educational purposes only. It is NOT intended to replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals.";
      const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 10);
      doc.text(splitDisclaimer, margin + 5, yPosition + 15);
      yPosition += 35;

      // Patient Information
      if (patientInfo.age || patientInfo.gender || patientInfo.duration) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Patient Information", margin, yPosition);
        yPosition += 10;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        if (patientInfo.age) {
          doc.text(`Age: ${patientInfo.age} years`, margin + 5, yPosition);
          yPosition += 6;
        }
        if (patientInfo.gender) {
          doc.text(`Gender: ${patientInfo.gender.charAt(0).toUpperCase() + patientInfo.gender.slice(1)}`, margin + 5, yPosition);
          yPosition += 6;
        }
        if (patientInfo.duration) {
          doc.text(`Symptom Duration: ${patientInfo.duration.replace(/-/g, ' ')}`, margin + 5, yPosition);
          yPosition += 6;
        }
        if (patientInfo.severity) {
          doc.text(`Severity Level: ${patientInfo.severity.charAt(0).toUpperCase() + patientInfo.severity.slice(1)}`, margin + 5, yPosition);
          yPosition += 6;
        }
        yPosition += 10;
      }

      // Symptoms
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Reported Symptoms", margin, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const symptomsText = selectedSymptoms.map(s => s.replace(/_/g, ' ')).join(", ");
      const splitSymptoms = doc.splitTextToSize(`• ${symptomsText}`, pageWidth - 2 * margin - 10);
      doc.text(splitSymptoms, margin + 5, yPosition);
      yPosition += splitSymptoms.length * 5 + 15;

      // Diagnosis Results
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("AI Diagnostic Analysis Results", margin, yPosition);
      yPosition += 10;

      results.forEach((result, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`${index + 1}. ${result.condition}`, margin, yPosition);
        yPosition += 8;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Probability: ${Math.round(result.probability * 100)}% (Confidence Interval: ${result.confidenceInterval.map(v => Math.round(v * 100) + '%').join(' - ')})`, margin + 5, yPosition);
        yPosition += 6;

        doc.text(`Severity Level: ${result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}`, margin + 5, yPosition);
        yPosition += 6;

        const descriptionLines = doc.splitTextToSize(`Description: ${result.description}`, pageWidth - 2 * margin - 10);
        doc.text(descriptionLines, margin + 5, yPosition);
        yPosition += descriptionLines.length * 5 + 3;

        doc.text("Recommended Actions:", margin + 5, yPosition);
        yPosition += 5;
        
        result.recommendedActions.forEach(action => {
          const actionLines = doc.splitTextToSize(`• ${action}`, pageWidth - 2 * margin - 15);
          doc.text(actionLines, margin + 10, yPosition);
          yPosition += actionLines.length * 5;
        });
        yPosition += 8;
      });

      // Footer
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text("Generated by MedGuard AI Diagnostic System", margin, doc.internal.pageSize.getHeight() - 10);

      // Save the PDF
      doc.save(`medguard-diagnosis-report-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast({
        title: "Report Generated",
        description: "PDF diagnostic report has been downloaded successfully."
      });

      onGenerateReport();
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate PDF report. Please try again."
      });
    }
  };

  const shareReport = () => {
    const reportText = `MedGuard AI Diagnostic Report\n\nSymptoms: ${selectedSymptoms.map(s => s.replace(/_/g, ' ')).join(', ')}\n\nTop Diagnosis: ${results[0]?.condition} (${Math.round((results[0]?.probability || 0) * 100)}% probability)\n\n⚠ This AI analysis is for educational purposes only. Please consult healthcare professionals for proper medical advice.`;
    
    if (navigator.share) {
      navigator.share({
        title: "MedGuard AI Diagnostic Report",
        text: reportText
      }).then(() => {
        toast({
          title: "Report Shared",
          description: "Diagnostic report shared successfully."
        });
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(reportText);
        toast({
          title: "Copied to Clipboard",
          description: "Report text copied to clipboard."
        });
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(reportText);
      toast({
        title: "Copied to Clipboard",
        description: "Report text copied to clipboard."
      });
    }
  };

  if (results.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Generate Medical Report
        </CardTitle>
        <CardDescription>
          Create a comprehensive PDF report of your diagnostic analysis for healthcare professionals.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Report Summary</h4>
              <div className="text-sm text-muted-foreground">
                <div>Symptoms analyzed: {selectedSymptoms.length}</div>
                <div>Conditions identified: {results.length}</div>
                <div>Top match: {results[0]?.condition} ({Math.round((results[0]?.probability || 0) * 100)}%)</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Report Contents</h4>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">Patient Info</Badge>
                <Badge variant="secondary">Symptoms</Badge>
                <Badge variant="secondary">Diagnoses</Badge>
                <Badge variant="secondary">Recommendations</Badge>
                <Badge variant="secondary">Medical Disclaimer</Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={generatePDFReport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF Report
            </Button>
            <Button variant="outline" onClick={shareReport} className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}