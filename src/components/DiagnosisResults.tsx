import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  Activity,
  Clock
} from "lucide-react";
import type { DiagnosisResult } from "@/services/diagnosisService";

interface DiagnosisResultsProps {
  results: DiagnosisResult[];
  isLoading: boolean;
}

const severityConfig = {
  low: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
    label: "Low Risk"
  },
  medium: {
    icon: AlertCircle,
    color: "text-warning",
    bgColor: "bg-warning/10", 
    borderColor: "border-warning/20",
    label: "Medium Risk"
  },
  high: {
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
    label: "High Risk"
  },
  critical: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/20",
    borderColor: "border-destructive/30",
    label: "Critical"
  }
};

function ConfidenceIndicator({ probability, confidenceInterval }: { 
  probability: number; 
  confidenceInterval: [number, number] 
}) {
  const percentage = Math.round(probability * 100);
  const [lower, upper] = confidenceInterval.map(v => Math.round(v * 100));
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Probability</span>
        <span className="text-muted-foreground">
          {percentage}% (CI: {lower}%-{upper}%)
        </span>
      </div>
      <div className="relative">
        <Progress 
          value={percentage} 
          className="h-2"
        />
        {/* Confidence interval indicator */}
        <div 
          className="absolute top-0 h-2 bg-primary/30 rounded"
          style={{
            left: `${lower}%`,
            width: `${upper - lower}%`
          }}
        />
      </div>
    </div>
  );
}

function DiagnosisCard({ result, rank }: { result: DiagnosisResult; rank: number }) {
  const config = severityConfig[result.severity];
  const Icon = config.icon;
  
  return (
    <Card className={`${config.borderColor} border-2 transition-all hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${config.bgColor}`}>
              <Icon className={`h-4 w-4 ${config.color}`} />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-muted-foreground text-sm">#{rank}</span>
                {result.condition}
              </CardTitle>
              <Badge variant="outline" className={`${config.color} border-current mt-1`}>
                {config.label}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {Math.round(result.probability * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">Match</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-sm">
          {result.description}
        </CardDescription>
        
        <ConfidenceIndicator 
          probability={result.probability}
          confidenceInterval={result.confidenceInterval}
        />
        
        {result.commonSymptoms.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Key Symptoms
            </h4>
            <div className="flex flex-wrap gap-1">
              {result.commonSymptoms.slice(0, 6).map(symptom => (
                <Badge key={symptom} variant="secondary" className="text-xs">
                  {symptom.replace(/_/g, ' ')}
                </Badge>
              ))}
              {result.commonSymptoms.length > 6 && (
                <Badge variant="secondary" className="text-xs">
                  +{result.commonSymptoms.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {result.recommendedActions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Recommended Actions
            </h4>
            <ul className="space-y-1">
              {result.recommendedActions.slice(0, 3).map((action, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                  <span className="text-primary mt-0.5">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DiagnosisResults({ results, isLoading }: DiagnosisResultsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 animate-spin text-primary" />
            Analyzing Symptoms...
          </CardTitle>
          <CardDescription>
            Our AI is processing your symptoms and generating diagnostic predictions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (results.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No matching conditions found. Please review your symptoms or consult a healthcare professional 
          if you have concerns about your health.
        </AlertDescription>
      </Alert>
    );
  }

  const highestProbability = results[0]?.probability || 0;
  const hasHighRisk = results.some(r => r.severity === "high" || r.severity === "critical");

  return (
    <div className="space-y-6">
      {hasHighRisk && (
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>High-risk conditions detected.</strong> Please seek immediate medical attention.
            This AI analysis is not a substitute for professional medical diagnosis.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Diagnostic Analysis Results
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Analysis completed • {results.length} conditions identified • 
            Top match: {Math.round(highestProbability * 100)}% confidence
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {results.map((result, index) => (
          <DiagnosisCard 
            key={result.condition} 
            result={result} 
            rank={index + 1}
          />
        ))}
      </div>

      <Alert className="border-info bg-info/5">
        <AlertCircle className="h-4 w-4 text-info" />
        <AlertDescription className="text-info">
          <strong>Remember:</strong> These predictions are based on symptom analysis only. 
          Proper medical diagnosis requires physical examination, laboratory tests, and professional medical assessment.
        </AlertDescription>
      </Alert>
    </div>
  );
}