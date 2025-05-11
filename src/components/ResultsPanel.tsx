
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, Repeat, Users, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultCategory {
  score: number;
  risk: 'low' | 'moderate' | 'high';
}

interface ResultsData {
  eyeContact: ResultCategory;
  repetitiveMovements: ResultCategory;
  socialReciprocity: ResultCategory;
  overallRisk: 'low' | 'moderate' | 'high';
}

interface ResultsPanelProps {
  results: ResultsData | null;
  className?: string;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ results, className }) => {
  if (!results) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6 text-center">
          <Info className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Start video playback to begin AI analysis...</p>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'moderate':
        return 'text-amber-600 bg-amber-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Analysis Results</CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "font-semibold capitalize", 
              getRiskColor(results.overallRisk)
            )}
          >
            {results.overallRisk === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
            {results.overallRisk} Risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="details" className="flex-1">Detailed Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm font-medium">Eye Contact</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-auto text-xs", 
                      getRiskColor(results.eyeContact.risk)
                    )}
                  >
                    {results.eyeContact.risk}
                  </Badge>
                </div>
                <Progress value={results.eyeContact.score} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Reduced eye contact may indicate challenges in social communication.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Repeat className="h-4 w-4 mr-2 text-secondary" />
                  <span className="text-sm font-medium">Repetitive Movements</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-auto text-xs", 
                      getRiskColor(results.repetitiveMovements.risk)
                    )}
                  >
                    {results.repetitiveMovements.risk}
                  </Badge>
                </div>
                <Progress value={results.repetitiveMovements.score} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Repetitive behaviors like hand flapping may indicate restricted patterns of behavior.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-accent" />
                  <span className="text-sm font-medium">Social Reciprocity</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "ml-auto text-xs", 
                      getRiskColor(results.socialReciprocity.risk)
                    )}
                  >
                    {results.socialReciprocity.risk}
                  </Badge>
                </div>
                <Progress value={results.socialReciprocity.score} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Limited social interaction may indicate difficulties in social-emotional reciprocity.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-primary" />
                  Eye Contact Analysis
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <span>Limited eye gaze during social interaction sequences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <span>Short duration of eye contact when engaged with stimuli</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <span>Preference for looking at objects rather than faces</span>
                  </li>
                </ul>
              </div>
              
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Repeat className="h-4 w-4 mr-2 text-secondary" />
                  Repetitive Movement Patterns
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-secondary/20 text-secondary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <span>Hand flapping detected during moments of excitement</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-secondary/20 text-secondary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <span>Repetitive body rocking observed during seated activities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-secondary/20 text-secondary rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <span>Pattern of repeated object manipulation identified</span>
                  </li>
                </ul>
              </div>
              
              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-accent" />
                  Social Interaction Assessment
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-accent/20 text-accent rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                    <span>Limited response to name being called</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-accent/20 text-accent rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                    <span>Reduced joint attention behaviors (pointing, showing)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-accent/20 text-accent rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                    <span>Minimal back-and-forth social engagement with caregiver</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
          <p className="flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            This is a technology demo only. Results should not be used for diagnosis.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsPanel;
