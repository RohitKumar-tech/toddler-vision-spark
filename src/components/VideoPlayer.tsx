
import React, { useRef, useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Eye, Repeat, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface Marker {
  id: string;
  type: 'eye-contact' | 'repetitive-movement' | 'social-reciprocity';
  x: number;
  y: number;
  size: number;
  timestamp: number; // When this marker should appear
  duration: number; // How long it should remain visible
}

interface VideoPlayerProps {
  videoUrl: string;
  onAnalysisComplete?: (results: any) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onAnalysisComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<Marker[]>([]);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Generate sample markers for the demo
  useEffect(() => {
    if (!analysisStarted) return;

    // Clear any existing markers
    setMarkers([]);

    // Sample markers for eye contact detection
    const eyeContactMarkers = [
      {
        id: 'eye-1',
        type: 'eye-contact' as const,
        x: 45,
        y: 25,
        size: 40,
        timestamp: 2,
        duration: 4
      },
      {
        id: 'eye-2',
        type: 'eye-contact' as const,
        x: 55,
        y: 25,
        size: 40,
        timestamp: 8,
        duration: 3
      }
    ];

    // Sample markers for repetitive movements
    const repetitiveMovementMarkers = [
      {
        id: 'rep-1',
        type: 'repetitive-movement' as const,
        x: 70,
        y: 60,
        size: 60,
        timestamp: 4,
        duration: 5
      },
      {
        id: 'rep-2',
        type: 'repetitive-movement' as const,
        x: 30,
        y: 60,
        size: 60,
        timestamp: 12,
        duration: 4
      }
    ];

    // Sample markers for social reciprocity
    const socialReciprocityMarkers = [
      {
        id: 'soc-1',
        type: 'social-reciprocity' as const,
        x: 50,
        y: 70,
        size: 70,
        timestamp: 6,
        duration: 3
      },
      {
        id: 'soc-2',
        type: 'social-reciprocity' as const,
        x: 40,
        y: 50,
        size: 50,
        timestamp: 10,
        duration: 4
      }
    ];

    setMarkers([
      ...eyeContactMarkers,
      ...repetitiveMovementMarkers,
      ...socialReciprocityMarkers
    ]);
  }, [analysisStarted]);

  // Update visible markers based on current video time
  useEffect(() => {
    if (!analysisStarted) return;

    const currentVisible = markers.filter(marker => {
      const startTime = marker.timestamp;
      const endTime = startTime + marker.duration;
      return currentTime >= startTime && currentTime <= endTime;
    });

    setVisibleMarkers(currentVisible);

    // Check if analysis is complete
    if (currentTime >= duration * 0.9 && !analysisComplete) {
      setAnalysisComplete(true);
      if (onAnalysisComplete) {
        onAnalysisComplete({
          eyeContact: { score: 68, risk: 'moderate' },
          repetitiveMovements: { score: 74, risk: 'moderate' },
          socialReciprocity: { score: 62, risk: 'high' },
          overallRisk: 'moderate'
        });
      }
    }
  }, [currentTime, markers, analysisStarted, duration, analysisComplete, onAnalysisComplete]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      
      if (!analysisStarted) {
        setAnalysisStarted(true);
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
        
        {/* Render markers */}
        {visibleMarkers.map((marker) => (
          <div
            key={marker.id}
            className={cn(
              'feature-marker animate-pulse-marker',
              `${marker.type}-marker`
            )}
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
              width: `${marker.size}px`,
              height: `${marker.size}px`,
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
        </div>
      </div>
    </Card>
  );
};

export default VideoPlayer;
