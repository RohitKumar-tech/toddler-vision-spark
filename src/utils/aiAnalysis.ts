
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to use browser cache efficiently
env.allowLocalModels = false;
env.useBrowserCache = true;

// Types for our analysis results
export interface AnalysisResult {
  eyeContact: ResultCategory;
  repetitiveMovements: ResultCategory;
  socialReciprocity: ResultCategory;
  overallRisk: 'low' | 'moderate' | 'high';
  detectedMarkers: Marker[];
}

export interface ResultCategory {
  score: number;
  risk: 'low' | 'moderate' | 'high';
}

export interface Marker {
  id: string;
  type: 'eye-contact' | 'repetitive-movement' | 'social-reciprocity';
  x: number;
  y: number;
  size: number;
  timestamp: number;
  duration: number;
}

// Initialize the models
let poseDetectionModel: any = null;
let faceDetectionModel: any = null;
let objectDetectionModel: any = null;

// Function to initialize models
export const initModels = async (): Promise<boolean> => {
  try {
    // Initialize pose detection for repetitive movement analysis
    poseDetectionModel = await pipeline(
      'object-detection',
      'Xenova/detr-resnet-50',
      { device: 'webgpu' }
    );
    
    // Initialize face detection for eye contact analysis
    faceDetectionModel = await pipeline(
      'object-detection', 
      'Xenova/yolos-tiny', 
      { device: 'webgpu' }
    );
    
    return true;
  } catch (error) {
    console.error('Error initializing AI models:', error);
    return false;
  }
};

// Function to analyze a frame for eye contact detection
const analyzeEyeContact = async (imageData: string): Promise<{score: number, detections: any[]}> => {
  try {
    // Detect faces in the image
    const faceResults = await faceDetectionModel(imageData);
    
    // Calculate an eye contact score based on face detection
    // This is a simplified approach - in a real system you'd use a specialized gaze detection model
    let score = 0;
    
    if (faceResults && Array.isArray(faceResults)) {
      const faces = faceResults.filter(item => 
        item.score > 0.7 && ['person', 'face'].includes(item.label.toLowerCase())
      );
      
      // If faces detected and centered in frame (simple heuristic for "looking at camera")
      if (faces.length > 0) {
        const mainFace = faces[0];
        const centerX = mainFace.box.xmin + (mainFace.box.xmax - mainFace.box.xmin) / 2;
        const centerY = mainFace.box.ymin + (mainFace.box.ymax - mainFace.box.ymin) / 2;
        
        // Calculate how centered the face is (crude proxy for eye contact)
        // A real system would use a specialized eye tracking model
        const width = imageData.width || 640;
        const height = imageData.height || 480;
        const distanceFromCenter = Math.sqrt(
          Math.pow((centerX - width/2)/(width/2), 2) + 
          Math.pow((centerY - height/2)/(height/2), 2)
        );
        
        // Convert to a score (closer to center = higher score)
        score = Math.max(0, Math.min(100, 100 * (1 - distanceFromCenter)));
      }
      
      return { 
        score, 
        detections: faces 
      };
    }
    
    return { score: 0, detections: [] };
  } catch (error) {
    console.error('Error in eye contact analysis:', error);
    return { score: 0, detections: [] };
  }
};

// Function to analyze a frame for repetitive movement detection
const analyzeRepetitiveMovements = async (
  imageData: string, 
  previousPoses: any[]
): Promise<{score: number, detections: any[]}> => {
  try {
    // Detect poses in the image
    const poseResults = await poseDetectionModel(imageData);
    
    // In a real system, you'd analyze pose keypoints over time to detect repetitive patterns
    // For this demo, we'll use a simplified approach detecting similar poses over consecutive frames
    let score = 0;
    
    if (poseResults && Array.isArray(poseResults) && previousPoses.length > 0) {
      const persons = poseResults.filter(item => 
        item.score > 0.7 && item.label.toLowerCase() === 'person'
      );
      
      if (persons.length > 0 && previousPoses.length >= 3) {
        // Simplistic repetitive motion detection based on bounding box changes
        // This is just a proxy - a real system would analyze keypoint trajectories
        const recentBoxes = previousPoses.slice(-3).map(pose => pose.box);
        const currentBox = persons[0].box;
        
        // Calculate movement patterns (very simplified version)
        const movements = recentBoxes.map((box, i) => {
          if (i === 0) return 0;
          const prevBox = recentBoxes[i-1];
          return Math.abs(box.xmin - prevBox.xmin) + Math.abs(box.ymin - prevBox.ymin);
        });
        
        // Check for repetitive patterns in movement
        // A real system would use frequency analysis or ML classification
        const isRepetitive = movements.length >= 2 && 
          Math.abs(movements[1] - movements[0]) < 10 && 
          movements[0] > 5; // Some movement but similar pattern
          
        score = isRepetitive ? 70 : 30;
      }
      
      return { 
        score, 
        detections: persons 
      };
    }
    
    return { score: 0, detections: [] };
  } catch (error) {
    console.error('Error in repetitive movement analysis:', error);
    return { score: 0, detections: [] };
  }
};

// Function to analyze a frame for social reciprocity
const analyzeSocialReciprocity = async (
  imageData: string, 
  previousDetections: any[]
): Promise<{score: number, detections: any[]}> => {
  try {
    // For social reciprocity, we'd analyze interaction between people
    // and object attention patterns over time
    const poseResults = await poseDetectionModel(imageData);
    
    let score = 0;
    
    if (poseResults && Array.isArray(poseResults)) {
      const persons = poseResults.filter(item => 
        item.score > 0.7 && item.label.toLowerCase() === 'person'
      );
      
      if (persons.length > 1) {
        // Multiple people detected - analyze potential interactions
        // Simple heuristic: proximity of people suggests interaction
        const person1 = persons[0];
        const person2 = persons[1];
        
        // Calculate distance between bounding boxes
        const distance = Math.sqrt(
          Math.pow(
            (person1.box.xmin + (person1.box.xmax - person1.box.xmin)/2) -
            (person2.box.xmin + (person2.box.xmax - person2.box.xmin)/2), 2
          ) +
          Math.pow(
            (person1.box.ymin + (person1.box.ymax - person1.box.ymin)/2) -
            (person2.box.ymin + (person2.box.ymax - person2.box.ymin)/2), 2
          )
        );
        
        // Closer proximity suggests higher interaction
        // This is a simplified heuristic
        score = Math.max(0, Math.min(100, 100 * (1 - distance/500)));
      } else {
        // Single person - analyze consistency of attention over time
        score = 50; // Neutral score for single person
      }
      
      return { 
        score, 
        detections: persons 
      };
    }
    
    return { score: 0, detections: [] };
  } catch (error) {
    console.error('Error in social reciprocity analysis:', error);
    return { score: 0, detections: [] };
  }
};

// Function to classify risk level based on score
const classifyRisk = (score: number): 'low' | 'moderate' | 'high' => {
  if (score >= 70) {
    return 'low';
  } else if (score >= 40) {
    return 'moderate';
  } else {
    return 'high';
  }
};

// Create a marker from a detection
const createMarker = (
  detection: any, 
  type: 'eye-contact' | 'repetitive-movement' | 'social-reciprocity', 
  timestamp: number
): Marker => {
  const width = detection.box.xmax - detection.box.xmin;
  const height = detection.box.ymax - detection.box.ymin;
  const size = Math.max(40, Math.min(width, height));
  
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    x: ((detection.box.xmin + detection.box.xmax) / 2) / 640 * 100, // convert to percentage
    y: ((detection.box.ymin + detection.box.ymax) / 2) / 480 * 100, // convert to percentage
    size,
    timestamp,
    duration: 3
  };
};

// Main analysis function for video frames
export const analyzeVideoFrame = async (
  videoElement: HTMLVideoElement, 
  currentTime: number,
  previousPoses: any[] = [],
  previousSocialDetections: any[] = []
): Promise<{
  frameAnalysis: { 
    eyeContact: {score: number, risk: 'low' | 'moderate' | 'high'}, 
    repetitiveMovements: {score: number, risk: 'low' | 'moderate' | 'high'}, 
    socialReciprocity: {score: number, risk: 'low' | 'moderate' | 'high'}
  }, 
  markers: Marker[],
  detectedPoses: any[],
  detectedSocialElements: any[]
}> => {
  try {
    // Create canvas to extract the current frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Draw the current video frame to the canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Get the image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Perform analyses
    const eyeContactAnalysis = await analyzeEyeContact(imageData);
    const repetitiveAnalysis = await analyzeRepetitiveMovements(imageData, previousPoses);
    const socialAnalysis = await analyzeSocialReciprocity(imageData, previousSocialDetections);
    
    // Create markers from detections
    const markers: Marker[] = [];
    
    // Add eye contact markers
    if (eyeContactAnalysis.detections.length > 0) {
      eyeContactAnalysis.detections.slice(0, 1).forEach(detection => {
        markers.push(createMarker(detection, 'eye-contact', currentTime));
      });
    }
    
    // Add repetitive movement markers
    if (repetitiveAnalysis.detections.length > 0) {
      repetitiveAnalysis.detections.slice(0, 1).forEach(detection => {
        markers.push(createMarker(detection, 'repetitive-movement', currentTime));
      });
    }
    
    // Add social interaction markers
    if (socialAnalysis.detections.length > 0) {
      socialAnalysis.detections.slice(0, 1).forEach(detection => {
        markers.push(createMarker(detection, 'social-reciprocity', currentTime));
      });
    }
    
    // Compile results
    const frameAnalysis = {
      eyeContact: {
        score: eyeContactAnalysis.score,
        risk: classifyRisk(eyeContactAnalysis.score)
      },
      repetitiveMovements: {
        score: repetitiveAnalysis.score,
        risk: classifyRisk(repetitiveAnalysis.score)
      },
      socialReciprocity: {
        score: socialAnalysis.score,
        risk: classifyRisk(socialAnalysis.score)
      }
    };
    
    return {
      frameAnalysis,
      markers,
      detectedPoses: repetitiveAnalysis.detections,
      detectedSocialElements: socialAnalysis.detections
    };
  } catch (error) {
    console.error('Error analyzing video frame:', error);
    return {
      frameAnalysis: {
        eyeContact: { score: 0, risk: 'high' },
        repetitiveMovements: { score: 0, risk: 'high' },
        socialReciprocity: { score: 0, risk: 'high' }
      },
      markers: [],
      detectedPoses: [],
      detectedSocialElements: []
    };
  }
};

// Generate the final analysis result
export const generateAnalysisResult = (
  eyeContactScores: number[],
  repetitiveMovementScores: number[],
  socialReciprocityScores: number[],
  detectedMarkers: Marker[]
): AnalysisResult => {
  // Average the scores
  const avgEyeContact = eyeContactScores.length > 0 
    ? eyeContactScores.reduce((acc, val) => acc + val, 0) / eyeContactScores.length 
    : 50;
  
  const avgRepetitiveMovements = repetitiveMovementScores.length > 0 
    ? repetitiveMovementScores.reduce((acc, val) => acc + val, 0) / repetitiveMovementScores.length 
    : 50;
  
  const avgSocialReciprocity = socialReciprocityScores.length > 0 
    ? socialReciprocityScores.reduce((acc, val) => acc + val, 0) / socialReciprocityScores.length 
    : 50;
  
  // Determine risk levels
  const eyeContactRisk = classifyRisk(avgEyeContact);
  const repetitiveMovementsRisk = classifyRisk(avgRepetitiveMovements);
  const socialReciprocityRisk = classifyRisk(avgSocialReciprocity);
  
  // Determine overall risk (simple logic - can be more sophisticated)
  let overallRisk: 'low' | 'moderate' | 'high' = 'low';
  const riskCount = {
    high: 0,
    moderate: 0,
    low: 0
  };
  
  [eyeContactRisk, repetitiveMovementsRisk, socialReciprocityRisk].forEach(risk => {
    riskCount[risk]++;
  });
  
  if (riskCount.high >= 1) {
    overallRisk = 'high';
  } else if (riskCount.moderate >= 2) {
    overallRisk = 'moderate';
  } else if (riskCount.moderate === 1 && riskCount.low === 2) {
    overallRisk = 'moderate';
  } else {
    overallRisk = 'low';
  }
  
  return {
    eyeContact: {
      score: Math.round(avgEyeContact),
      risk: eyeContactRisk
    },
    repetitiveMovements: {
      score: Math.round(avgRepetitiveMovements),
      risk: repetitiveMovementsRisk
    },
    socialReciprocity: {
      score: Math.round(avgSocialReciprocity),
      risk: socialReciprocityRisk
    },
    overallRisk,
    detectedMarkers
  };
};
