import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Note, Meeting } from "../types/note";
import { fetchNote, enhanceNoteWithAI } from "../api/noteApi";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import SidePanel from "../components/SidePanel";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useUI } from "../contexts/UIContext";
import NoteControls from "../components/NoteControls";

export default function NotePage() {
  const { id } = useParams();
  const [isNew] = useState(!id);
  const [note, setNote] = useState<Note | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [showHypercharge, setShowHypercharge] = useState(false);
  const { isPanelOpen } = useUI();

  const {
    isRecording,
    isPaused,
    transcript,
    currentTranscript,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useSpeechRecognition();

  useEffect(() => {
    if (id && !isNew) {
      // 기존 노트 데이터 불러오기
      const loadNote = async () => {
        const noteData = await fetchNote(id);
        setNote(noteData);
        setNoteTitle(noteData.title);
        setNoteContent(noteData.content);
      };
      loadNote();
    }
  }, [id]);

  useEffect(() => {
    if (isNew || (note?.meeting && shouldStartRecording(note.meeting))) {
      startRecording();
    }

    const timer = setInterval(() => {
      if (isRecording && !isPaused) {
        setRecordingTime((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      void stopRecording();
      clearInterval(timer);
    };
  }, [isNew, note]);

  const shouldStartRecording = (meeting: Meeting) => {
    const now = new Date();
    return now >= meeting.startTime;
  };

  const handlePauseResume = async () => {
    if (isPaused) {
      await resumeRecording();
      setShowHypercharge(false);
    } else {
      await pauseRecording();
      setShowHypercharge(true);
    }
  };

  const handleHypercharge = async () => {
    const enhancedNote = await enhanceNoteWithAI(noteContent, transcript);
    setNoteContent(enhancedNote.content);
    if (!noteTitle) {
      setNoteTitle(enhancedNote.suggestedTitle);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <main className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={100} minSize={50}>
            <div className="flex h-full flex-col">
              <header className="border-b bg-white p-4">
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder={isNew ? "제목 없음" : ""}
                  className="w-full text-lg font-medium focus:outline-none"
                />
                {note?.meeting && (
                  <div className="mt-1 text-sm text-gray-500">
                    {formatMeetingTime(note.meeting.startTime)}
                  </div>
                )}
              </header>

              <div className="relative flex flex-1 flex-col">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full flex-1 resize-none p-4 focus:outline-none"
                  placeholder="노트를 입력하세요..."
                  autoFocus
                />
                <NoteControls
                  note={note}
                  showHypercharge={showHypercharge}
                  isRecording={isRecording}
                  isPaused={isPaused}
                  recordingTime={recordingTime}
                  onHypercharge={handleHypercharge}
                  onStart={startRecording}
                  onPauseResume={handlePauseResume}
                  currentTranscript={currentTranscript}
                />
              </div>
            </div>
          </Panel>

          {isPanelOpen && (
            <>
              <PanelResizeHandle />
              <Panel defaultSize={30} minSize={30} maxSize={50}>
                <SidePanel isOpen={isPanelOpen} noteContent={noteContent} />
              </Panel>
            </>
          )}
        </PanelGroup>
      </main>
    </div>
  );
}

const formatMeetingTime = (startTime: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
