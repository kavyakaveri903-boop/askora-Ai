/**
 * Browser Speech Utilities: Text-to-Speech (TTS) and Voice-to-Text (SpeechRecognition)
 * with robust error handling and clipboard helpers.
 */

// Global tracker to stop ongoing audio when switching answers
let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Reads aloud the given text using browser SpeechSynthesis.
 * Returns true if speech was started, false otherwise.
 */
export function speakAnswer(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    // Cancel any existing speech
    window.speechSynthesis.cancel();

    // Strip HTML/Markdown if any
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      currentUtterance = utterance;
      onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      // Interrupted error is common when cancelled, ignore it
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('SpeechSynthesis error:', e.error);
      }
      currentUtterance = null;
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Failed to speak text:', err);
    currentUtterance = null;
    onEnd?.();
    return false;
  }
}

/**
 * Stops any speech currently in progress.
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    } catch {
      // ignore
    }
  }
}

/**
 * Checks if Text-to-Speech is available in current browser.
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

// Type declaration for browser SpeechRecognition
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

/**
 * Checks if Speech Recognition (Voice Input) is supported.
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

let activeRecognition: SpeechRecognitionInstance | null = null;

/**
 * Starts speech recognition session.
 */
export function startVoiceRecognition(
  onResult: (transcript: string) => void,
  onError: (errorMsg: string) => void,
  onEnd: () => void
): boolean {
  if (!isSpeechRecognitionSupported()) {
    onError('Voice input is not supported in this browser.');
    return false;
  }

  try {
    if (activeRecognition) {
      activeRecognition.abort();
      activeRecognition = null;
    }

    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition: SpeechRecognitionInstance = new SpeechRecognitionConstructor();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      const err = event.error;
      if (err === 'not-allowed') {
        onError('Microphone access was denied. Please allow microphone permission in your browser.');
      } else if (err === 'no-speech') {
        onError('No speech detected. Please try speaking again.');
      } else {
        onError(`Voice recognition error: ${err}`);
      }
    };

    recognition.onend = () => {
      activeRecognition = null;
      onEnd();
    };

    activeRecognition = recognition;
    recognition.start();
    return true;
  } catch (err: any) {
    activeRecognition = null;
    onError('Could not start microphone: ' + (err?.message || 'unknown error'));
    onEnd();
    return false;
  }
}

/**
 * Stops active voice recognition session.
 */
export function stopVoiceRecognition(): void {
  if (activeRecognition) {
    try {
      activeRecognition.stop();
    } catch {
      // ignore
    }
    activeRecognition = null;
  }
}

/**
 * Robust copy helper that handles clipboard API restrictions in iframe.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback to execCommand
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback clipboard copy failed:', err);
    return false;
  }
}
