import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Note, CalendarEvent } from "../types";
import { fetchNote, enhanceNoteWithAI } from "../api/noteApi";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import SidePanel from "../components/SidePanel";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useUI } from "../contexts/UIContext";
import LiveCaptionDock from "../components/LiveCaptionDock";
import NoteHeader from "../components/NoteHeader";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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

  const editor = useEditor({
    extensions: [StarterKit],
    content: noteContent,
    onUpdate: ({ editor }) => {
      setNoteContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (id && !isNew) {
      const loadNote = async () => {
        const noteData = await fetchNote(id);
        setNote(noteData);
        setNoteTitle(noteData.title);
        setNoteContent(noteData.rawMemo);
      };
      loadNote();
    }
  }, [id]);

  useEffect(() => {
    if (
      isNew ||
      (note?.calendarEvent && shouldStartRecording(note.calendarEvent))
    ) {
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

  useEffect(() => {
    if (editor && editor.getHTML() !== noteContent) {
      editor.commands.setContent(noteContent);
    }
  }, [noteContent, editor]);

  const shouldStartRecording = (event: CalendarEvent) => {
    const now = new Date();
    const startTime = event.start.dateTime
      ? new Date(event.start.dateTime)
      : event.start.date
        ? new Date(event.start.date)
        : null;

    return startTime ? now >= startTime : false;
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
    const enhancedNote = await enhanceNoteWithAI(noteTitle, noteContent, []);
    setNoteContent(enhancedNote.content);
    if (!noteTitle && enhancedNote.suggestedTitle) {
      setNoteTitle(enhancedNote.suggestedTitle);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <main className="flex-1">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={100} minSize={50}>
            <div className="flex h-full flex-col">
              <NoteHeader
                note={note}
                isNew={isNew}
                noteTitle={noteTitle}
                showHypercharge={showHypercharge}
                isRecording={isRecording}
                isPaused={isPaused}
                recordingTime={recordingTime}
                onTitleChange={setNoteTitle}
                onHypercharge={handleHypercharge}
                onStartRecording={startRecording}
                onPauseResume={handlePauseResume}
              />

              <div className="relative flex flex-1 flex-col">
                <EditorContent
                  editor={editor}
                  className="prose w-full max-w-none flex-1 p-4 focus:outline-none"
                />
                <LiveCaptionDock currentTranscript={currentTranscript} />
              </div>
            </div>
          </Panel>

          {isPanelOpen && (
            <>
              <PanelResizeHandle />
              <Panel defaultSize={30} minSize={30} maxSize={50}>
                <SidePanel noteContent={noteContent} />
              </Panel>
            </>
          )}
        </PanelGroup>
      </main>
    </div>
  );
}
