import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Stethoscope, 
  Brain, 
  Shield, 
  FileText,
  Activity,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze symptoms to provide accurate diagnostic predictions with confidence intervals.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Confidence Metrics", 
      description: "Get probability scores and uncertainty metrics to help assess diagnostic certainty and guide further testing.",
      color: "text-success"
    },
    {
      icon: FileText,
      title: "Medical Reports",
      description: "Generate comprehensive PDF reports for healthcare professionals with detailed analysis and recommendations.",
      color: "text-info"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your medical data stays private. All analysis happens securely with proper medical disclaimers and guidelines.",
      color: "text-warning"
    }
  ];

  const stats = [
    { label: "Common Diseases", value: "6+", icon: Activity },
    { label: "Symptom Categories", value: "5", icon: Users },
    { label: "Analysis Time", value: "<2s", icon: Clock },
    { label: "Accuracy Rate", value: "85%+", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 rounded-full bg-primary/10">
              <Stethoscope className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-info to-success bg-clip-text text-transparent">
            MedGuard AI Diagnosis System
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Advanced machine learning-powered disease diagnosis system that predicts common illnesses 
            based on patient-reported symptoms with confidence intervals and uncertainty metrics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/diagnosis">
              <Button size="lg" className="h-14 px-8 text-lg font-medium">
                <Brain className="h-5 w-5 mr-2" />
                Start AI Diagnosis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg" asChild>
              <a href="#features">
                Learn More
              </a>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="h-5 w-5 text-primary mr-1" />
                    <span className="text-2xl font-bold text-primary">{stat.value}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful AI Diagnostic Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our advanced system combines machine learning with medical expertise to provide 
              accurate and reliable diagnostic assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/20 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How MedGuard AI Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple three-step process to get AI-powered diagnostic insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Select Symptoms",
                description: "Choose from categorized symptoms across different body systems with severity indicators.",
                icon: Activity
              },
              {
                step: "2", 
                title: "AI Analysis",
                description: "Our machine learning model analyzes symptom patterns and generates probability predictions.",
                icon: Brain
              },
              {
                step: "3",
                title: "Review Results",
                description: "Get ranked diagnoses with confidence intervals and recommended next steps.",
                icon: FileText
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="text-center relative">
                  <CardHeader>
                    <div className="mx-auto mb-4 relative">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                        {step.step}
                      </div>
                      <div className="absolute -top-2 -right-2 p-2 rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <CardTitle>{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Supported Conditions */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Supported Medical Conditions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI model can identify and analyze common medical conditions with high accuracy
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Malaria", severity: "high", accuracy: "92%" },
              { name: "Typhoid Fever", severity: "high", accuracy: "89%" },
              { name: "Influenza (Flu)", severity: "medium", accuracy: "91%" },
              { name: "Pneumonia", severity: "high", accuracy: "87%" },
              { name: "Food Poisoning", severity: "medium", accuracy: "85%" },
              { name: "Common Cold", severity: "low", accuracy: "94%" }
            ].map((condition, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{condition.name}</h4>
                  <Badge 
                    variant={condition.severity === "high" ? "destructive" : 
                            condition.severity === "medium" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {condition.severity} risk
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  {condition.accuracy} accuracy
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="bg-gradient-to-r from-primary/10 via-info/10 to-success/10 border-primary/20">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your AI Diagnosis?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
                Get instant AI-powered medical insights with confidence intervals and uncertainty metrics. 
                Always consult healthcare professionals for proper medical care.
              </p>
              
              <Link to="/diagnosis">
                <Button size="lg" className="h-14 px-12 text-lg font-medium">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Start Free AI Diagnosis
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>

              <p className="text-sm text-muted-foreground mt-4">
                No registration required • Free to use • Privacy protected
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Index;
