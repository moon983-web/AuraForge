import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Avatar Creator
      avatarCreator: {
        title: "Avatar Creator",
        description: "Generate a random avatar or customize below",
        generating: "Generating...",
        generateRandom: "Generate Random Avatar",
        currentAvatar: "Current Avatar",
        name: "Name",
        gender: "Gender",
        voice: "Voice"
      },

      // Customization
      customization: {
        title: "Customize Avatar",
        noAvatar: "Generate an avatar to start customization",
        appearance: "Look",
        personality: "Mind",
        voice: "Voice",
        saved: "Saved",
        name: "Name",
        gender: "Gender",
        bodyType: "Body Type",
        skinTone: "Skin Tone",
        hairColor: "Hair Color",
        eyeColor: "Eye Color",
        clothing: "Clothing",
        topColor: "Top Color",
        bottomColor: "Bottom Color",
        trait1: "Primary Trait",
        trait2: "Secondary Trait",
        chattiness: "Chattiness",
        voiceType: "Voice Type",
        voicePitch: "Pitch",
        voiceSpeed: "Speed",
        savedAvatars: "Saved Avatars",
        noSaved: "No saved avatars yet"
      },

      // Gender
      gender: {
        male: "Male",
        female: "Female",
        other: "Other"
      },

      // Body Types
      bodyType: {
        slim: "Slim",
        athletic: "Athletic",
        curvy: "Curvy"
      },

      // Personality Traits
      personality: {
        friendly: "Friendly",
        mysterious: "Mysterious",
        playful: "Playful",
        serious: "Serious",
        adventurous: "Adventurous",
        calm: "Calm",
        intelligent: "Intelligent",
        creative: "Creative",
        humorous: "Humorous",
        empathetic: "Empathetic",
        confident: "Confident",
        curious: "Curious"
      },

      // Voice
      voice: {
        male: "Male",
        female: "Female",
        neutral: "Neutral"
      },

      // Conversation
      conversation: {
        title: "Chat with",
        startConversation: "Start a conversation with your avatar!",
        placeholder: "Type your message...",
        you: "You",
        typing: "is typing...",
        listening: "Listening...",
        speaking: "Speaking...",
        messages: "messages",
        error: "Sorry, I couldn't process that. Please try again."
      },

      // LM Studio
      lmstudio: {
        connecting: "Connecting...",
        connected: "Connected",
        timeout: "Connection timeout",
        offline: "LM Studio offline",
        error: "Connection error",
        unknown: "Unknown error",
        notConnected: "Not connected to LM Studio",
        noResponse: "No response from AI",
        responseTimeout: "Response timeout",
        unknownError: "Unknown error occurred"
      },

      // Language
      language: {
        toggle: "Toggle Language"
      }
    }
  },
  de: {
    translation: {
      // Avatar Creator
      avatarCreator: {
        title: "Avatar-Ersteller",
        description: "Generiere einen zufälligen Avatar oder passe unten an",
        generating: "Generiere...",
        generateRandom: "Zufälligen Avatar generieren",
        currentAvatar: "Aktueller Avatar",
        name: "Name",
        gender: "Geschlecht",
        voice: "Stimme"
      },

      // Customization
      customization: {
        title: "Avatar anpassen",
        noAvatar: "Generiere einen Avatar um mit der Anpassung zu beginnen",
        appearance: "Aussehen",
        personality: "Persönlichkeit",
        voice: "Stimme",
        saved: "Gespeichert",
        name: "Name",
        gender: "Geschlecht",
        bodyType: "Körpertyp",
        skinTone: "Hautton",
        hairColor: "Haarfarbe",
        eyeColor: "Augenfarbe",
        clothing: "Kleidung",
        topColor: "Oberteil-Farbe",
        bottomColor: "Unterteil-Farbe",
        trait1: "Haupteigenschaft",
        trait2: "Nebeneigenschaft",
        chattiness: "Gesprächigkeit",
        voiceType: "Stimmtyp",
        voicePitch: "Tonhöhe",
        voiceSpeed: "Geschwindigkeit",
        savedAvatars: "Gespeicherte Avatare",
        noSaved: "Noch keine Avatare gespeichert"
      },

      // Gender
      gender: {
        male: "Männlich",
        female: "Weiblich",
        other: "Andere"
      },

      // Body Types
      bodyType: {
        slim: "Schlank",
        athletic: "Athletisch",
        curvy: "Kurvig"
      },

      // Personality Traits
      personality: {
        friendly: "Freundlich",
        mysterious: "Geheimnisvoll",
        playful: "Verspielt",
        serious: "Ernst",
        adventurous: "Abenteuerlich",
        calm: "Ruhig",
        intelligent: "Intelligent",
        creative: "Kreativ",
        humorous: "Humorvoll",
        empathetic: "Empathisch",
        confident: "Selbstbewusst",
        curious: "Neugierig"
      },

      // Voice
      voice: {
        male: "Männlich",
        female: "Weiblich",
        neutral: "Neutral"
      },

      // Conversation
      conversation: {
        title: "Chat mit",
        startConversation: "Beginne ein Gespräch mit deinem Avatar!",
        placeholder: "Schreibe deine Nachricht...",
        you: "Du",
        typing: "schreibt...",
        listening: "Höre zu...",
        speaking: "Spreche...",
        messages: "Nachrichten",
        error: "Entschuldigung, ich konnte das nicht verarbeiten. Bitte versuche es erneut."
      },

      // LM Studio
      lmstudio: {
        connecting: "Verbinde...",
        connected: "Verbunden",
        timeout: "Verbindungs-Timeout",
        offline: "LM Studio offline",
        error: "Verbindungsfehler",
        unknown: "Unbekannter Fehler",
        notConnected: "Nicht mit LM Studio verbunden",
        noResponse: "Keine Antwort von der KI",
        responseTimeout: "Antwort-Timeout",
        unknownError: "Unbekannter Fehler aufgetreten"
      },

      // Language
      language: {
        toggle: "Sprache wechseln"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
