import { useState, useCallback, useEffect } from "react";

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");

  // Mock phrases for demonstration
  const mockPhrases = [
    "안녕하세요, 오늘 회의를 시작하겠습니다.",
    "첫 번째 안건은 신규 기능 개발에 관한 것입니다.",
    "두 번째로 일정 관리에 대해 논의하겠습니다.",
    "마지막으로 다음 주 계획을 정리해보겠습니다.",
  ];

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setIsPaused(false);

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockPhrases.length) {
        setCurrentTranscript(mockPhrases[index]);
        setTranscript((prev) => prev + "\n" + mockPhrases[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const pauseRecording = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeRecording = useCallback(() => {
    setIsPaused(false);
    startRecording();
  }, [startRecording]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    setIsPaused(false);
    setCurrentTranscript("");
  }, []);

  return {
    isRecording,
    isPaused,
    transcript,
    currentTranscript,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  };
};
