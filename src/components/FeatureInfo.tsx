
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Repeat, Users, ArrowRight } from "lucide-react";

const FeatureInfo = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Key Behavioral Markers</CardTitle>
        <CardDescription>
          Early signs that AI can detect from video analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Eye className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Reduced Eye Contact</h3>
            <p className="text-xs text-muted-foreground mt-1">
              AI algorithms track gaze direction and duration of eye contact during social interactions. 
              Children with ASD often show reduced or inconsistent eye contact patterns.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="bg-secondary/10 p-2 rounded-full">
            <Repeat className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Repetitive Movements</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Computer vision detects repetitive body movements such as hand flapping, rocking, or 
              spinning. These stereotyped motor behaviors are common in autism spectrum disorders.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="bg-accent/10 p-2 rounded-full">
            <Users className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Social Reciprocity</h3>
            <p className="text-xs text-muted-foreground mt-1">
              AI assesses social engagement behaviors like response to name, joint attention (pointing/showing), 
              and back-and-forth social interaction with caregivers.
            </p>
          </div>
        </div>
        
        <div className="bg-muted/50 p-3 rounded-lg mt-4">
          <h4 className="text-xs font-semibold flex items-center">
            <ArrowRight className="h-3 w-3 mr-1 text-primary" />
            How it works
          </h4>
          <p className="text-xs mt-1">
            Our AI uses computer vision and machine learning to analyze behavioral patterns 
            in video. The system tracks facial expressions, body movements, and social interactions,
            comparing them to typical developmental patterns to identify potential signs of autism.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureInfo;
