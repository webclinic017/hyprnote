export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  isVirtual: boolean;
  meetingUrl?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  transcript: string;
  meetingId?: string;
  meeting?: Meeting;
}

export interface EnhancedNoteResult {
  content: string;
  suggestedTitle: string;
}
