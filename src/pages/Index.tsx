
import React, { useState } from "react";
import Header from "@/components/Header";
import VideoUpload from "@/components/VideoUpload";
import VideoPlayer from "@/components/VideoPlayer";
import ResultsPanel from "@/components/ResultsPanel";
import FeatureInfo from "@/components/FeatureInfo";
import TechnicalInfo from "@/components/TechnicalInfo";

const Index = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [results, setResults] = useState<any | null>(null);

  const handleVideoSelected = (url: string) => {
    setVideoUrl(url);
    setResults(null); // Reset results when new video is selected
  };

  const handleAnalysisComplete = (analysisResults: any) => {
    setResults(analysisResults);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="flex-grow container py-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Early Autism Detection System
          <span className="text-primary"> AI Prototype</span>
        </h1>
        
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          This proof-of-concept demonstrates how AI computer vision can identify early behavioral 
          signs of autism in toddlers through non-invasive video analysis.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!videoUrl ? (
              <VideoUpload onVideoSelected={handleVideoSelected} />
            ) : (
              <VideoPlayer 
                videoUrl={videoUrl} 
                onAnalysisComplete={handleAnalysisComplete} 
              />
            )}
            
            <ResultsPanel results={results} />
          </div>
          
          <div className="space-y-6">
            <FeatureInfo />
            <TechnicalInfo />
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 text-center text-sm mt-8">
          <p className="font-medium">Disclaimer</p>
          <p className="text-xs text-muted-foreground mt-1">
            This is a technology demonstration only. The system is not intended for clinical diagnosis
            and should not replace professional medical assessment. All data shown is simulated for 
            demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
