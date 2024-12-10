import { Note, EnhancedNoteResult } from "../types/note";

export const fetchNote = async (id: string): Promise<Note> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    id,
    title: "주간 회의 - 제품 로드맵 논의",
    content: "기존 노트 내용입니다...",
    transcript: "회의 전사 내용입니다...",
    meetingId: "meeting-123",
    meeting: {
      id: "meeting-123",
      title: "주간 회의 - 제품 로드맵 논의",
      startTime: new Date(Date.now() - 1000 * 60 * 15),
      isVirtual: true,
      meetingUrl: "https://meet.google.com/mock-meeting",
    },
  };
};

export const enhanceNoteWithAI = async (
  content: string,
  transcript: string
): Promise<EnhancedNoteResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    content:
      content +
      "\n\n### AI 보강 내용 ###\n" +
      "1. 주요 논의 사항:\n" +
      "   - 신규 기능 개발 계획\n" +
      "   - 일정 관리 방안\n" +
      "   - 다음 주 계획\n\n" +
      "2. 결정된 사항:\n" +
      "   - 개발 우선순위 조정\n" +
      "   - 주간 회의 시간 변경\n",
    suggestedTitle: "제품 개발 전략 회의 - 우선순위 및 일정 조정",
  };
};
