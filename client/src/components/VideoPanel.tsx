import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Pause, 
  Play,
  Languages,
  Video,
  VideoOff
} from 'lucide-react';

interface VideoPanelProps {
  isCallActive: boolean;
  isMuted: boolean;
  currentLanguage: 'en' | 'hi';
  onToggleMute: () => void;
  onEndCall: () => void;
  onLanguageChange: (lang: 'en' | 'hi') => void;
}

export const VideoPanel: React.FC<VideoPanelProps> = ({
  isCallActive,
  isMuted,
  currentLanguage,
  onToggleMute,
  onEndCall,
  onLanguageChange
}) => {
  const [isOnHold, setIsOnHold] = React.useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);

  return (
    <div className="h-full flex flex-col bg-video-bg">
      {/* Main Video Feed */}
      <div className="flex-1 relative bg-video-bg">
        <div className="w-full h-full flex items-center justify-center text-white">
          {isCallActive ? (
            <div className="text-center">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-60" />
              <p className="text-sm opacity-80">Patient Video Feed</p>
              <p className="text-xs opacity-60 mt-1">Connected</p>
            </div>
          ) : (
            <div className="text-center">
              <VideoOff className="h-16 w-16 mx-auto mb-4 opacity-60" />
              <p className="text-sm opacity-80">Call Ended</p>
            </div>
          )}
        </div>

        {/* Doctor's PIP Video */}
        {isCallActive && (
          <div className="absolute bottom-4 right-4 w-24 h-18 bg-video-controls rounded-lg border border-gray-600 flex items-center justify-center">
            <div className="text-white text-xs text-center">
              <Video className="h-4 w-4 mx-auto mb-1 opacity-60" />
              <p className="opacity-80">You</p>
            </div>
          </div>
        )}

        {/* Language Indicator */}
        <div className="absolute top-4 left-4">
          <Badge 
            variant="secondary" 
            className="bg-video-controls text-white border-gray-600 hover:bg-gray-600 cursor-pointer"
            onClick={() => onLanguageChange(currentLanguage === 'en' ? 'hi' : 'en')}
          >
            <Languages className="h-3 w-3 mr-1" />
            Transcription: {currentLanguage === 'en' ? 'English' : 'हिंदी'}
          </Badge>
        </div>
      </div>

      {/* Call Controls */}
      <div className="p-4 bg-video-controls border-t border-gray-600">
        <div className="flex justify-center space-x-3">
          <Button
            size="sm"
            variant={isMuted ? "destructive" : "secondary"}
            onClick={onToggleMute}
            className="rounded-full w-12 h-12"
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            size="sm"
            variant={isOnHold ? "outline" : "secondary"}
            onClick={() => setIsOnHold(!isOnHold)}
            className="rounded-full w-12 h-12"
          >
            {isOnHold ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </Button>

          <Button
            size="sm"
            variant={isVideoEnabled ? "secondary" : "outline"}
            onClick={() => setIsVideoEnabled(!isVideoEnabled)}
            className="rounded-full w-12 h-12"
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={onEndCall}
            className="rounded-full w-12 h-12"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center mt-3 space-x-4 text-xs text-gray-300">
          <span className={isMuted ? "text-red-400" : "text-green-400"}>
            {isMuted ? "Muted" : "Mic On"}
          </span>
          <span className={isOnHold ? "text-yellow-400" : "text-green-400"}>
            {isOnHold ? "On Hold" : "Active"}
          </span>
          <span className={isVideoEnabled ? "text-green-400" : "text-gray-400"}>
            {isVideoEnabled ? "Video On" : "Video Off"}
          </span>
        </div>
      </div>
    </div>
  );
};