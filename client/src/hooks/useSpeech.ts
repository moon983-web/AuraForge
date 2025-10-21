import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AvatarVoice } from "../lib/avatarTypes";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export function useSpeech(voice: AvatarVoice) {
  const { i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastTranscript, setLastTranscript] = useState<string>("");
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;

    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      synthRef.current = speechSynthesis;

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = i18n.language === 'de' ? 'de-DE' : 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setLastTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
      };

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      console.warn('Speech Recognition or Speech Synthesis not supported');
    }

    return () => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
      if (synthRef.current && isSpeaking) {
        synthRef.current.cancel();
      }
    };
  }, [i18n.language, isListening, isSpeaking]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || !voice.enabled) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice based on avatar settings
    utterance.pitch = voice.pitch;
    utterance.rate = voice.speed;
    utterance.volume = 0.8;
    utterance.lang = i18n.language === 'de' ? 'de-DE' : 'en-US';

    // Try to find a voice that matches the avatar's voice type
    const voices = synthRef.current.getVoices();
    const targetGender = voice.type === 'male' ? 'Male' : voice.type === 'female' ? 'Female' : null;
    const targetLang = utterance.lang;

    let selectedVoice = null;

    if (targetGender) {
      selectedVoice = voices.find(v => 
        v.lang.startsWith(targetLang.split('-')[0]) && 
        v.name.toLowerCase().includes(targetGender.toLowerCase())
      );
    }

    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith(targetLang.split('-')[0]));
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, [voice, i18n.language]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  // Update recognition language when i18n language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = i18n.language === 'de' ? 'de-DE' : 'en-US';
    }
  }, [i18n.language]);

  return {
    isListening,
    isSpeaking,
    isSupported,
    lastTranscript,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  };
}
