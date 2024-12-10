interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  onStart: () => void;
  onPauseResume: () => void;
}

export default function RecordingControls({
  isRecording,
  isPaused,
  recordingTime,
  onStart,
  onPauseResume,
}: RecordingControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex gap-2">
      {isRecording ? (
        <button
          onClick={onPauseResume}
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm ${
            isPaused
              ? "bg-gray-50 text-gray-600 hover:bg-gray-100"
              : "bg-red-50 text-red-600 hover:bg-red-100"
          }`}
        >
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              isPaused ? "bg-gray-500" : "animate-pulse bg-red-500"
            }`}
          />
          {isPaused ? "일시정지 중" : formatTime(recordingTime)}
        </button>
      ) : (
        <button
          onClick={onStart}
          className="rounded-full bg-emerald-50 px-4 py-1.5 text-sm text-emerald-600 hover:bg-emerald-100"
        >
          녹음 시작
        </button>
      )}
    </div>
  );
}
