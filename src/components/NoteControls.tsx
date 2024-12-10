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
  return (
    <div className="absolute bottom-6 left-1/2 w-full max-w-2xl -translate-x-1/2">
      <div className="mx-4 rounded-xl border border-gray-100 bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex gap-2">
            {note?.meeting?.isVirtual && note?.meeting?.meetingUrl && (
              <button
                onClick={() => window.open(note?.meeting?.meetingUrl)}
                className="rounded-full bg-blue-50 px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-100"
              >
                미팅 참여하기
              </button>
            )}
            {showHypercharge && (
              <button
                onClick={onHypercharge}
                className="flex items-center gap-1 rounded-full bg-purple-50 px-4 py-1.5 text-sm text-purple-600 hover:bg-purple-100"
              >
                <Zap size={16} />
                하이퍼차지
              </button>
            )}
          </div>

          <LiveCaption text={currentTranscript} />

          <RecordingControls
            isRecording={isRecording}
            isPaused={isPaused}
            recordingTime={recordingTime}
            onStart={onStart}
            onPauseResume={onPauseResume}
          />
        </div>
      </div>
    </div>
  );
}
