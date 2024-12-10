interface LiveCaptionProps {
  text: string;
}

export default function LiveCaption({ text }: LiveCaptionProps) {
  if (!text) return null;

  return (
    <div className="flex-1 rounded-lg bg-black/75 px-4 py-2 text-sm text-white">
      {text}
    </div>
  );
}
