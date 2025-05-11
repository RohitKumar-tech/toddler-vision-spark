
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Film, Play, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const VideoUpload = ({ onVideoSelected }: { onVideoSelected: (videoUrl: string) => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Demo videos for testing
  const demoVideos = [
    { name: "Demo 1: Reduced Eye Contact", url: "https://storage.googleapis.com/autism-detection-demo/eye_contact_demo.mp4" },
    { name: "Demo 2: Repetitive Movements", url: "https://storage.googleapis.com/autism-detection-demo/repetitive_movements_demo.mp4" },
    { name: "Demo 3: Social Interaction", url: "https://storage.googleapis.com/autism-detection-demo/social_interaction_demo.mp4" },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Create a URL for the video
    const videoUrl = URL.createObjectURL(file);
    
    // Simulate processing delay
    setTimeout(() => {
      onVideoSelected(videoUrl);
      setIsLoading(false);
      toast({
        title: "Video uploaded successfully",
        description: "The AI analysis will begin automatically.",
      });
    }, 1500);
  };

  const handleDemoVideoSelect = (url: string) => {
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      onVideoSelected(url);
      setIsLoading(false);
      toast({
        title: "Demo video loaded",
        description: "The AI analysis will begin automatically.",
      });
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          } transition-colors duration-200 cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("video-upload")?.click()}
        >
          <input
            type="file"
            id="video-upload"
            className="hidden"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Upload Video</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Drag and drop a video file or click to browse
              </p>
              {isLoading && (
                <div className="flex items-center justify-center mt-2">
                  <RotateCw className="h-4 w-4 animate-spin text-primary mr-2" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Or use a demo video:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {demoVideos.map((video, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="flex items-center justify-start px-3 py-2 h-auto text-left"
                onClick={() => handleDemoVideoSelect(video.url)}
                disabled={isLoading}
              >
                <Film className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate text-xs">{video.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoUpload;
