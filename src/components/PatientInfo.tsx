import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar, Timer } from "lucide-react";

export interface PatientInfoData {
  age?: number;
  gender?: "male" | "female" | "other";
  duration?: string;
  severity?: "mild" | "moderate" | "severe";
}

interface PatientInfoProps {
  patientInfo: PatientInfoData;
  onInfoChange: (info: PatientInfoData) => void;
}

export function PatientInfo({ patientInfo, onInfoChange }: PatientInfoProps) {
  const updateInfo = (field: keyof PatientInfoData, value: string | number) => {
    onInfoChange({
      ...patientInfo,
      [field]: value
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Patient Information
        </CardTitle>
        <CardDescription>
          Optional information to help improve diagnostic accuracy.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Age (optional)
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="Enter age"
            min="0"
            max="120"
            value={patientInfo.age || ""}
            onChange={(e) => updateInfo("age", e.target.value ? parseInt(e.target.value) : undefined)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            Gender (optional)
          </Label>
          <Select 
            value={patientInfo.gender || ""} 
            onValueChange={(value) => updateInfo("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            Symptom Duration
          </Label>
          <Select 
            value={patientInfo.duration || ""} 
            onValueChange={(value) => updateInfo("duration", value)}
          >
            <SelectTrigger id="duration">
              <SelectValue placeholder="How long have you had these symptoms?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less-than-24h">Less than 24 hours</SelectItem>
              <SelectItem value="1-3-days">1-3 days</SelectItem>
              <SelectItem value="4-7-days">4-7 days</SelectItem>
              <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
              <SelectItem value="more-than-2-weeks">More than 2 weeks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="severity" className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            Overall Severity
          </Label>
          <Select 
            value={patientInfo.severity || ""} 
            onValueChange={(value) => updateInfo("severity", value)}
          >
            <SelectTrigger id="severity">
              <SelectValue placeholder="How severe are your symptoms?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mild">Mild - Not interfering with daily activities</SelectItem>
              <SelectItem value="moderate">Moderate - Some interference with activities</SelectItem>
              <SelectItem value="severe">Severe - Significant interference with activities</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}