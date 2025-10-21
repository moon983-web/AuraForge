export type PersonalityTrait = 
  | 'friendly' | 'mysterious' | 'playful' | 'serious' 
  | 'adventurous' | 'calm' | 'intelligent' | 'creative' 
  | 'humorous' | 'empathetic' | 'confident' | 'curious';

export interface AvatarAppearance {
  gender: 'male' | 'female' | 'other';
  bodyType: 'slim' | 'athletic' | 'curvy';
  height?: number; // 0.7-1.3 scale multiplier (defaults to 1.0 for legacy avatars)
  muscleDefinition?: number; // 0-100 (defaults to 0 for legacy avatars)
  skinTone: string; // Hex color
  hairColor: string; // Hex color
  eyeColor: string; // Hex color
  clothing: {
    color: string; // Hex color for top
    bottomColor?: string; // Hex color for bottom
    style?: 'casual' | 'formal' | 'fantasy' | 'futuristic' | 'sporty'; // defaults to 'casual' for legacy avatars
  };
}

export interface AvatarPersonality {
  trait1: PersonalityTrait;
  trait2: PersonalityTrait;
  chattiness: number; // 0-100, how talkative the avatar is
  interests: string[]; // Array of interests/hobbies
}

export interface AvatarVoice {
  type: 'male' | 'female' | 'neutral';
  pitch: number; // 0.5-2.0, for text-to-speech
  speed: number; // 0.5-2.0, for text-to-speech
  enabled: boolean; // Whether to use text-to-speech
}

export interface Avatar {
  id: string;
  name: string;
  appearance: AvatarAppearance;
  personality: AvatarPersonality;
  voice: AvatarVoice;
  createdAt: Date;
  lastModified?: Date;
}

export interface AvatarPreset {
  id: string;
  name: string;
  description: string;
  avatar: Omit<Avatar, 'id' | 'createdAt' | 'lastModified'>;
}

// Utility types for customization
export type AvatarCustomization = Partial<Omit<Avatar, 'id' | 'createdAt'>>;

export interface AvatarGenerationOptions {
  gender?: 'male' | 'female' | 'other' | 'random';
  theme?: 'random' | 'fantasy' | 'modern' | 'futuristic';
  personalityBias?: PersonalityTrait[];
}
