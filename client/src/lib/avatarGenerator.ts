import { Avatar, PersonalityTrait } from "./avatarTypes";

// Arrays of possible values for random generation
const FIRST_NAMES = {
  male: ['Alex', 'Blake', 'Carter', 'Dylan', 'Ethan', 'Felix', 'Gabriel', 'Hunter', 'Ian', 'Jack', 'Kyle', 'Logan'],
  female: ['Aria', 'Bella', 'Clara', 'Diana', 'Emma', 'Fiona', 'Grace', 'Hanna', 'Isabella', 'Jade', 'Kira', 'Luna'],
  other: ['Avery', 'Casey', 'Drew', 'Ellis', 'Finley', 'Gray', 'Harper', 'Jordan', 'Kai', 'Lane', 'Morgan', 'Nova']
};

const LAST_NAMES = ['Anderson', 'Bennett', 'Cooper', 'Davis', 'Evans', 'Foster', 'Gray', 'Hayes', 'Irving', 'Jones', 'Kelly', 'Lopez'];

const SKIN_TONES = ['#FFDBAC', '#F4A460', '#D2B48C', '#CD853F', '#A0522D', '#8B4513', '#654321'];
const HAIR_COLORS = ['#000000', '#654321', '#8B4513', '#D2691E', '#FF4500', '#FFD700', '#90EE90', '#0000FF', '#8A2BE2'];
const EYE_COLORS = ['#8B4513', '#000000', '#0000FF', '#008000', '#808080', '#FFA500'];
const CLOTHING_COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#FFA500', '#800080'];

const PERSONALITY_TRAITS: PersonalityTrait[] = [
  'friendly', 'mysterious', 'playful', 'serious', 'adventurous', 'calm',
  'intelligent', 'creative', 'humorous', 'empathetic', 'confident', 'curious'
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomName(gender: 'male' | 'female' | 'other'): string {
  const firstName = getRandomElement(FIRST_NAMES[gender]);
  const lastName = getRandomElement(LAST_NAMES);
  return `${firstName} ${lastName}`;
}

export function generateRandomAvatar(): Avatar {
  const gender = getRandomElement(['male', 'female', 'other'] as const);
  const name = generateRandomName(gender);
  
  // Select two different personality traits
  const shuffledTraits = [...PERSONALITY_TRAITS].sort(() => Math.random() - 0.5);
  const trait1 = shuffledTraits[0];
  const trait2 = shuffledTraits[1];

  return {
    id: `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    appearance: {
      gender,
      bodyType: getRandomElement(['slim', 'athletic', 'curvy']),
      skinTone: getRandomElement(SKIN_TONES),
      hairColor: getRandomElement(HAIR_COLORS),
      eyeColor: getRandomElement(EYE_COLORS),
      clothing: {
        color: getRandomElement(CLOTHING_COLORS),
        bottomColor: getRandomElement(CLOTHING_COLORS),
        style: 'casual'
      }
    },
    personality: {
      trait1,
      trait2,
      chattiness: Math.floor(Math.random() * 81) + 20, // 20-100
      interests: []
    },
    voice: {
      type: gender === 'other' ? getRandomElement(['male', 'female', 'neutral']) : 
            gender === 'male' ? 'male' : 'female',
      pitch: Math.round((Math.random() * 1.5 + 0.5) * 10) / 10, // 0.5-2.0
      speed: Math.round((Math.random() * 1.5 + 0.5) * 10) / 10, // 0.5-2.0
      enabled: true
    },
    createdAt: new Date(),
    lastModified: new Date()
  };
}

export function generateVariation(baseAvatar: Avatar): Avatar {
  const variation = { ...baseAvatar };
  
  // Generate new ID and update timestamps
  variation.id = `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  variation.createdAt = new Date();
  variation.lastModified = new Date();
  
  // Randomly modify some attributes (50% chance for each)
  if (Math.random() > 0.5) {
    variation.appearance.hairColor = getRandomElement(HAIR_COLORS);
  }
  
  if (Math.random() > 0.5) {
    variation.appearance.eyeColor = getRandomElement(EYE_COLORS);
  }
  
  if (Math.random() > 0.5) {
    variation.appearance.clothing.color = getRandomElement(CLOTHING_COLORS);
  }
  
  if (Math.random() > 0.5) {
    variation.appearance.clothing.bottomColor = getRandomElement(CLOTHING_COLORS);
  }
  
  if (Math.random() > 0.3) {
    // Select a new random personality trait
    const availableTraits = PERSONALITY_TRAITS.filter(t => t !== variation.personality.trait1);
    variation.personality.trait2 = getRandomElement(availableTraits);
  }
  
  if (Math.random() > 0.7) {
    variation.personality.chattiness = Math.floor(Math.random() * 81) + 20;
  }
  
  return variation;
}

// Generate a themed avatar based on a style
export function generateThemedAvatar(theme: 'fantasy' | 'modern' | 'futuristic'): Avatar {
  const baseAvatar = generateRandomAvatar();
  
  switch (theme) {
    case 'fantasy':
      baseAvatar.appearance.hairColor = getRandomElement(['#FFD700', '#8A2BE2', '#FF4500', '#90EE90']);
      baseAvatar.appearance.clothing.color = getRandomElement(['#800080', '#8B4513', '#006400', '#8B0000']);
      baseAvatar.personality.trait1 = getRandomElement(['mysterious', 'adventurous', 'serious']);
      break;
      
    case 'modern':
      baseAvatar.appearance.hairColor = getRandomElement(['#000000', '#654321', '#8B4513', '#D2691E']);
      baseAvatar.appearance.clothing.color = getRandomElement(['#000000', '#FFFFFF', '#808080', '#000080']);
      baseAvatar.personality.trait1 = getRandomElement(['friendly', 'confident', 'creative']);
      break;
      
    case 'futuristic':
      baseAvatar.appearance.hairColor = getRandomElement(['#00FFFF', '#FF00FF', '#FFFF00', '#0000FF']);
      baseAvatar.appearance.clothing.color = getRandomElement(['#00FFFF', '#FF00FF', '#C0C0C0', '#000000']);
      baseAvatar.personality.trait1 = getRandomElement(['intelligent', 'curious', 'serious']);
      break;
  }
  
  return baseAvatar;
}
