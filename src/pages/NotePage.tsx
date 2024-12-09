import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function NotePage() {
  const { id } = useParams();
  const [isNew] = useState(!id);
  const [isRecording, setIsRecording] = useState(isNew);
  const [noteContent, setNoteContent] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (isNew) {
      startRecording();
    }

    // 녹음 시간 타이머
    const timer = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);

    return () => {
      void stopRecording();
      clearInterval(timer);
    };
  }, []);

  const startRecording = async () => {
    // 여기에 Tauri API를 사용한 녹음 로직 구현
    console.log("녹음이 시작되었습니다");
  };

  const stopRecording = async () => {
    // 녹음 중지 로직 구현
    console.log("녹음이 중지되었습니다");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b p-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-lg font-medium">
            {isNew ? "새로운 노트" : "노트 보기"}
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full">
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          className="w-full h-full resize-none p-4 focus:outline-none"
          placeholder="노트를 입력하세요..."
          autoFocus
        />
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto z-10">
        <div className="mx-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
          {isRecording && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
              {transcript || "음성을 인식하는 중..."}
            </div>
          )}

          <div className="flex justify-end">
            {isRecording ? (
              <button
                onClick={() => setIsRecording(false)}
                className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-sm hover:bg-red-100 flex items-center gap-2"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                {formatTime(recordingTime)}
              </button>
            ) : (
              <button
                onClick={() => setIsRecording(true)}
                className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-sm hover:bg-emerald-100"
              >
                녹음 시작
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
