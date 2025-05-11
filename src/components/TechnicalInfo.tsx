
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, FileCode, Brain } from "lucide-react";

const TechnicalInfo = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Brain className="h-4 w-4 mr-2 text-primary" />
          Technical Approach
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs text-muted-foreground">
        <div>
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <Code className="h-4 w-4 mr-2 text-primary" />
            Computer Vision Models
          </h3>
          <ul className="mt-2 space-y-2 pl-6 list-disc">
            <li>Pose estimation using MediaPipe to track body movements</li>
            <li>Facial landmark detection to analyze gaze direction</li>
            <li>Action recognition models to identify repetitive behaviors</li>
            <li>Object tracking to monitor interaction with toys/objects</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-foreground flex items-center">
            <FileCode className="h-4 w-4 mr-2 text-primary" />
            Feature Extraction
          </h3>
          <ul className="mt-2 space-y-2 pl-6 list-disc">
            <li>Temporal analysis of gaze patterns and duration</li>
            <li>Frequency analysis of repetitive movements</li>
            <li>Social engagement metrics derived from interaction sequences</li>
            <li>Response latency to social and environmental stimuli</li>
          </ul>
        </div>
        
        <div className="bg-muted p-3 rounded-lg">
          <h4 className="text-xs font-semibold text-foreground">Privacy & Ethics</h4>
          <p className="mt-1">
            This system is designed to process video data locally when possible, with strong 
            encryption for any cloud processing. All analysis is performed with full respect for 
            privacy and medical data protection standards. This tool is intended as a screening 
            aid, not a diagnostic replacement for clinical assessment.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicalInfo;
