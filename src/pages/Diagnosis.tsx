import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { 
  Stethoscope, 
  Brain, 
  FileText, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

import { MedicalDisclaimer } from "@/components/MedicalDisclaimer";
import { SymptomSelector } from "@/components/SymptomSelector";
import { PatientInfo, type PatientInfoData } from "@/components/PatientInfo";
import { DiagnosisResults } from "@/components/DiagnosisResults";
import { ReportGenerator } from "@/components/ReportGenerator";
import { 
  generateDiagnosis, 
  validatePatientData,
  type DiagnosisResult 
} from "@/services/diagnosisService";
import { toast } from "@/hooks/use-toast";

export default function Diagnosis() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfoData>({});
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    // Validate input
    const patientData = {
      ...patientInfo,
      symptoms: selectedSymptoms
    };

    const validationErrors = validatePatientData(patientData);
    if (validationErrors.length > 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: validationErrors[0]
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const results = await generateDiagnosis(patientData);
      setDiagnosisResults(results);
      setHasAnalyzed(true);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${results.length} potential conditions. Review the results carefully.`
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ 
          behavior: "smooth" 
        });
      }, 100);

    } catch (error) {
      console.error("Diagnosis error:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "An error occurred during analysis. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setPatientInfo({});
    setDiagnosisResults([]);
    setHasAnalyzed(false);
    
    toast({
      title: "Reset Complete",
      description: "Ready for new diagnosis analysis."
    });
  };

  const handleReportGenerated = () => {
    toast({
      title: "Report Generated",
      description: "Medical report has been successfully created."
    });
  };

  const canAnalyze = selectedSymptoms.length > 0 && !isAnalyzing;
  const hasHighRiskResults = diagnosisResults.some(r => 
    r.severity === "high" || r.severity === "critical"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              MedGuard AI Diagnosis
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced AI-powered medical diagnosis system that analyzes symptoms to identify potential conditions 
            with confidence intervals and uncertainty metrics.
          </p>
        </div>

        {/* Medical Disclaimer */}
        <MedicalDisclaimer />

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Indicator */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Diagnostic Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      selectedSymptoms.length > 0 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      1
                    </div>
                    <span className={`text-sm ${
                      selectedSymptoms.length > 0 ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      Select Symptoms
                    </span>
                    {selectedSymptoms.length > 0 && (
                      <Badge variant="secondary">{selectedSymptoms.length} selected</Badge>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      hasAnalyzed 
                        ? "bg-primary text-primary-foreground" 
                        : canAnalyze ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      2
                    </div>
                    <span className={`text-sm ${
                      hasAnalyzed ? "text-foreground" : canAnalyze ? "text-primary" : "text-muted-foreground"
                    }`}>
                      AI Analysis
                    </span>
                    {hasAnalyzed && (
                      <Badge variant="secondary">{diagnosisResults.length} results</Badge>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      hasAnalyzed 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      3
                    </div>
                    <span className={`text-sm ${
                      hasAnalyzed ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      Review Results
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Symptom Selection */}
            <SymptomSelector 
              selectedSymptoms={selectedSymptoms}
              onSymptomsChange={setSelectedSymptoms}
            />

            {/* Patient Information */}
            <PatientInfo 
              patientInfo={patientInfo}
              onInfoChange={setPatientInfo}
            />

            {/* Analysis Button */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className="flex-1 h-12"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Brain className="h-5 w-5 mr-2 animate-spin" />
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="h-5 w-5 mr-2" />
                        Start AI Diagnosis
                      </>
                    )}
                  </Button>
                  
                  {hasAnalyzed && (
                    <Button 
                      onClick={handleReset}
                      variant="outline"
                      className="sm:w-auto"
                    >
                      New Analysis
                    </Button>
                  )}
                </div>
                
                {selectedSymptoms.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Please select at least one symptom to begin analysis
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary & Status */}
          <div className="space-y-6">
            {/* Analysis Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Symptoms</div>
                      <div className="font-medium">{selectedSymptoms.length}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Status</div>
                      <div className="font-medium">
                        {isAnalyzing ? "Analyzing..." : hasAnalyzed ? "Complete" : "Ready"}
                      </div>
                    </div>
                    {hasAnalyzed && (
                      <>
                        <div>
                          <div className="text-muted-foreground">Conditions</div>
                          <div className="font-medium">{diagnosisResults.length}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Top Match</div>
                          <div className="font-medium">
                            {diagnosisResults[0] ? `${Math.round(diagnosisResults[0].probability * 100)}%` : "-"}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  {hasAnalyzed && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Risk Assessment</h4>
                      <div className="flex items-center gap-2">
                        {hasHighRiskResults ? (
                          <>
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            <span className="text-sm text-destructive font-medium">High Risk Detected</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-sm text-success font-medium">Low-Medium Risk</span>
                          </>
                        )}
                      </div>
                      {hasHighRiskResults && (
                        <p className="text-xs text-muted-foreground">
                          Seek immediate medical attention for high-risk conditions.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {hasAnalyzed && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Results
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => document.getElementById("report-section")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Results Section */}
        {(hasAnalyzed || isAnalyzing) && (
          <div id="results-section" className="mt-12 space-y-8">
            <Separator />
            
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Diagnostic Analysis Results</h2>
              <p className="text-muted-foreground">
                AI-powered analysis with confidence intervals and uncertainty metrics
              </p>
            </div>

            <DiagnosisResults 
              results={diagnosisResults}
              isLoading={isAnalyzing}
            />

            {/* Report Generation */}
            {hasAnalyzed && diagnosisResults.length > 0 && (
              <div id="report-section">
                <ReportGenerator 
                  results={diagnosisResults}
                  selectedSymptoms={selectedSymptoms}
                  patientInfo={patientInfo}
                  onGenerateReport={handleReportGenerated}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}