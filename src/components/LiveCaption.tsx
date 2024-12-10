import { useEffect, useRef, useState } from "react";

interface LiveCaptionProps {
  text: string;
}

export default function LiveCaption({ text }: LiveCaptionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!text) return;

    // 새로운 텍스트가 들어오면 lines 배열에 추가
    setLines((prev) => {
      const newLines = [...prev];
      if (text !== newLines[newLines.length - 1]) {
        newLines.push(text);
      }
      // 최대 5개의 최근 라인만 유지
      return newLines.slice(-5);
    });
  }, [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 자동 스크롤
    container.scrollTop = container.scrollHeight;
  }, [lines]);

  return (
    <div
      ref={containerRef}
      className="h-11 w-full snap-y snap-mandatory overflow-y-auto rounded-lg bg-black/75 px-4 py-2 text-center text-sm text-white"
    >
      {lines.map((line, index) => (
        <div key={index} className="snap-start py-3">
          {line}
        </div>
      ))}
    </div>
  );
}
