import { useState } from "react";
import { Zap } from "lucide-react";
import type { Note } from "../types/note";
import LiveCaption from "./LiveCaption";
import RecordingControls from "./RecordingControls";

interface NoteFooterProps {
  note: Note | null;
  showHypercharge: boolean;
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  currentTranscript: string;
  onHypercharge: () => void;
  onStart: () => void;
  onPauseResume: () => void;
}

export default function NoteControls({
  note,
  showHypercharge,
  isRecording,
  isPaused,
  recordingTime,
  currentTranscript,
  onHypercharge,
  onStart,
  onPauseResume,
}: NoteFooterProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="absolute bottom-6 left-1/2 flex w-full max-w-xl -translate-x-1/2 flex-col items-center gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex items-center justify-center gap-4 transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-30"
        }`}
      >
        {note?.meeting?.isVirtual && note?.meeting?.meetingUrl && (
          <button
            onClick={() => window.open(note?.meeting?.meetingUrl)}
            className="rounded-full bg-blue-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-blue-600"
          >
            미팅 참여하기
          </button>
        )}

        {showHypercharge && (
          <button
            onClick={onHypercharge}
            className="flex items-center gap-1 rounded-full bg-purple-500 px-4 py-1.5 text-sm text-white transition-colors hover:bg-purple-600"
          >
            <Zap size={16} />
            하이퍼차지
          </button>
        )}

        <RecordingControls
          isRecording={isRecording}
          isPaused={isPaused}
          recordingTime={recordingTime}
          onStart={onStart}
          onPauseResume={onPauseResume}
        />
      </div>

      <LiveCaption text={currentTranscript} />
    </div>
  );
}
