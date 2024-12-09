import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [isNewUser, setIsNewUser] = useState(true); // 인증 시스템에서 가져올 값
  const navigate = useNavigate();

  // 목업 데이터 추가
  const mockNotes = [
    {
      id: "1",
      title: "주간 회의 - 제품 로드맵 논의",
      date: "2024-03-20",
      duration: "32:15",
      preview: "Q1 목표 달성을 위한 주요 기능 개발 계획 논의...",
    },
    {
      id: "2",
      title: "팀 스크럼 미팅",
      date: "2024-03-19",
      duration: "15:45",
      preview: "스프린트 3 진행상황 점검 및 블로커 이슈 논의...",
    },
    {
      id: "3",
      title: "사용자 인터뷰 - 김OO님",
      date: "2024-03-18",
      duration: "45:30",
      preview: "신규 기능에 대한 사용자 피드백 및 개선사항...",
    },
  ];

  const handleNewNote = () => {
    const noteId = crypto.randomUUID();
    navigate(`/note/${noteId}`);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="space-y-8">
        {isNewUser && (
          <section>
            <h2 className="text-xl font-semibold mb-4">다가오는 일정</h2>
            <div className="bg-white rounded-lg shadow-sm p-4 flex items-center cursor-pointer hover:bg-gray-50">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-4">
                <img
                  src="/avatar.png"
                  alt="프로필 사진"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium">하이퍼 시작하기</h3>
                <p className="text-emerald-600 text-sm">
                  데모 미팅 체험하기 (2분)
                </p>
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-4">최근 노트</h2>

          <div className="space-y-4">
            {mockNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => navigate(`/note/${note.id}`)}
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{note.title}</h3>
                  <span className="text-sm text-gray-500">{note.duration}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{note.preview}</p>
                <p className="text-xs text-gray-400">{note.date}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
