
import React, { useEffect, useRef, useState } from 'react';
import { Room, LocalVideoTrack, createLocalVideoTrack } from 'livekit-client';

interface CameraViewProps {
  room: Room;
  onCameraToggle: (enabled: boolean) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ room, onCameraToggle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleCamera = async () => {
    try {
      setError(null);
      const newState = !isCameraEnabled;
      
      if (newState) {
        const track = await createLocalVideoTrack({
          facingMode: 'user',
          resolution: { width: 640, height: 480 }
        });
        await room.localParticipant.publishTrack(track);
        setLocalTrack(track);
        if (videoRef.current) {
          track.attach(videoRef.current);
        }
      } else {
        if (localTrack) {
          await room.localParticipant.unpublishTrack(localTrack);
          localTrack.detach();
          await localTrack.stop();
          setLocalTrack(null);
        }
      }
      setIsCameraEnabled(newState);
      onCameraToggle(newState);
    } catch (error) {
      console.error('Error toggling camera:', error);
      setError('Could not access camera. Please check your camera permissions and try again.');
      setIsCameraEnabled(false);
      onCameraToggle(false);
    }
  };

  useEffect(() => {
    return () => {
      if (localTrack) {
        localTrack.detach();
        room.localParticipant.unpublishTrack(localTrack);
      }
    };
  }, [localTrack, room]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative flex-1 bg-gray-900 rounded-lg overflow-hidden min-h-[200px] md:min-h-[300px]">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {!isCameraEnabled && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 bg-opacity-90">
            <div className="text-center">
              <p className="text-white text-sm md:text-lg mb-4">Camera is off</p>
              <button
                onClick={toggleCamera}
                className="px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base font-medium"
              >
                Turn On Camera
              </button>
            </div>
          </div>
        )}
        {isCameraEnabled && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={toggleCamera}
              className="px-4 py-2 md:px-6 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base font-medium shadow-lg"
            >
              Turn Off Camera
            </button>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs md:text-sm">
          {error}
        </div>
      )}
    </div>
  );
};
