
import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Eye, Repeat, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { initModels, analyzeVideoFrame, generateAnalysisResult, type Marker } from "@/utils/aiAnalysis";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  onAnalysisComplete?: (results: any) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onAnalysisComplete }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<Marker[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Store analysis data
  const [eyeContactScores, setEyeContactScores] = useState<number[]>([]);
  const [repetitiveMovementScores, setRepetitiveMovementScores] = useState<number[]>([]);
  const [socialReciprocityScores, setSocialReciprocityScores] = useState<number[]>([]);
  const [detectedPoses, setDetectedPoses] = useState<any[]>([]);
  const [detectedSocialElements, setDetectedSocialElements] = useState<any[]>([]);
  const [allDetectedMarkers, setAllDetectedMarkers] = useState<Marker[]>([]);

  // Load AI models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        const loaded = await initModels();
        setModelsLoaded(loaded);
        if (loaded) {
          toast({
            title: "AI Models Loaded",
            description: "Ready to analyze video for autism detection markers.",
          });
        } else {
          toast({
            title: "Error Loading Models",
            description: "Could not load AI models. Analysis will be limited.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error loading models:", error);
        toast({
          title: "Error Loading Models",
          description: "Could not load AI models. Analysis will be limited.",
          variant: "destructive",
        });
      }
    };
    
    loadModels();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [toast]);

  // Handle video metadata loading
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Analyze the current video frame
  const analyzeCurrentFrame = async () => {
    if (!videoRef.current || !modelsLoaded || !analysisStarted || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      // Only analyze every 1 second (or another interval)
      if (Math.floor(currentTime) % 1 === 0) {
        const result = await analyzeVideoFrame(
          videoRef.current, 
          currentTime,
          detectedPoses,
          detectedSocialElements
        );
        
        // Update scores
        setEyeContactScores(prev => [...prev, result.frameAnalysis.eyeContact.score]);
        setRepetitiveMovementScores(prev => [...prev, result.frameAnalysis.repetitiveMovements.score]);
        setSocialReciprocityScores(prev => [...prev, result.frameAnalysis.socialReciprocity.score]);
        
        // Update detections
        setDetectedPoses(result.detectedPoses);
        setDetectedSocialElements(result.detectedSocialElements);
        
        // Update markers
        setMarkers(result.markers);
        setAllDetectedMarkers(prev => [...prev, ...result.markers]);
      }
    } catch (error) {
      console.error("Error analyzing frame:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Animation loop for analysis
  useEffect(() => {
    if (isPlaying && modelsLoaded && analysisStarted) {
      analyzeCurrentFrame();
    }
  }, [currentTime, isPlaying, modelsLoaded, analysisStarted]);

  // Update visible markers based on current time
  useEffect(() => {
    if (!analysisStarted) return;

    const currentVisible = allDetectedMarkers.filter(marker => {
      const startTime = marker.timestamp;
      const endTime = startTime + marker.duration;
      return currentTime >= startTime && currentTime <= endTime;
    });

    setVisibleMarkers(currentVisible);

    // Check if analysis is complete
    if (currentTime >= duration * 0.9 && !analysisComplete && eyeContactScores.length > 0) {
      setAnalysisComplete(true);
      
      // Generate final analysis results
      const finalResults = generateAnalysisResult(
        eyeContactScores,
        repetitiveMovementScores,
        socialReciprocityScores,
        allDetectedMarkers
      );
      
      if (onAnalysisComplete) {
        onAnalysisComplete(finalResults);
      }
      
      toast({
        title: "Analysis Complete",
        description: "Video analysis has been completed.",
      });
    }
  }, [currentTime, allDetectedMarkers, analysisStarted, duration, analysisComplete, eyeContactScores, repetitiveMovementScores, socialReciprocityScores, onAnalysisComplete, toast]);

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      
      if (!analysisStarted && modelsLoaded) {
        setAnalysisStarted(true);
        toast({
          title: "Analysis Started",
          description: "AI is now analyzing the video for autism markers.",
        });
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative" ref={containerRef}>
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* AI Model loading indicator */}
        {!modelsLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-center text-white">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading AI Models...</p>
              <p className="text-xs mt-1">This may take a moment</p>
            </div>
          </div>
        )}
        
        {/* Render markers from AI detection */}
        {visibleMarkers.map((marker) => (
          <div
            key={marker.id}
            className={cn(
              'feature-marker animate-pulse-marker absolute rounded-full',
              marker.type === 'eye-contact' ? 'bg-primary/30 border border-primary' : 
              marker.type === 'repetitive-movement' ? 'bg-secondary/30 border border-secondary' : 
              'bg-accent/30 border border-accent'
            )}
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              width: `${marker.size}px`,
              height: `${marker.size}px`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20 h-9 w-9" 
              onClick={togglePlayPause}
              disabled={!modelsLoaded}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <div className="flex space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-xs text-white">Eye Contact</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-xs text-white">Repetitive Movements</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-xs text-white">Social Interaction</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 bg-white/30 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-white h-full" 
              style={{ width: `${(currentTime / duration) * 100}%` }} 
            />
          </div>
          
          {/* Analysis status indicator */}
          {analysisStarted && (
            <div className="mt-2 flex items-center justify-center">
              {isAnalyzing ? (
                <span className="text-xs text-white flex items-center">
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  AI Analyzing...
                </span>
              ) : (
                <span className="text-xs text-white">
                  AI Monitoring{eyeContactScores.length > 0 ? ` (${eyeContactScores.length} frames analyzed)` : ''}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
