export type Language = 'en' | 'ur';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  likes: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  timestamp: number;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  contact: string;
  category: 'ngo' | 'doctor' | 'legal' | 'cybercrime' | 'lab';
  location?: {
    lat: number;
    lng: number;
  };
}

export interface AppState {
  language: Language;
  onboarded: boolean;
  chatHistory: Message[];
  theme: 'light' | 'dark';
}
