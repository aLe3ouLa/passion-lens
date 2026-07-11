export type VoiceStyle =
  | 'documentary'
  | 'cinematic'
  | 'poetic'
  | 'travel-journal';

export interface GeneratedMemory {
  title: string;
  moods: string[];
  visualDetails: string[];
  story: string;
  photographerInsight: string;
  passionProfile: {
    title: string;
    reflection: string;
    direction: string;
  };
}

export interface MemoryStoryState {
  generatedMemory: GeneratedMemory;
  imageUrl: string;
  location: string;
  meaning: string;
  voiceStyle: VoiceStyle;
}

export interface Memory {
  id: string;
  title: string;
  location: string;
  date: string;
  excerpt: string;
  story: string;
  moods: string[];
  photographerInsight: string;
  imageUrl: string;
  imageAlt: string;
  audioUrl?: string;
}
