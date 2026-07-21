import * as Speech from "expo-speech";

/**
 * Parses raw text matrices into clean audio speech synthesis streams natively [INDEX].
 */
export function speak(text: string): void {
  // Interrupts any playing text streams instantly to clear buffer frames
  Speech.stop();

  Speech.speak(text, {
    language: "en-IN", // Locks localized linguistic delivery matching India profiles
    pitch: 1.0,
    rate: 0.95, // Marginally decelerated pace facilitates maximum student focus comprehension
  });
}

/**
 * Halts all active speech execution threads immediately [INDEX].
 */
export function stopSpeaking(): void {
  Speech.stop();
}
