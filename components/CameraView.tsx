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
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {!isCameraEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
            <p className="text-white text-lg">Camera is off</p>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
      <button
        onClick={toggleCamera}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isCameraEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
      </button>
    </div>
  );
};