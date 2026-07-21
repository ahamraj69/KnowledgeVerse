import { Audio } from "expo-av";
import * as Speech from "expo-speech";

let nativeRecordingInstance: Audio.Recording | null = null;

export function speak(text: string): void {
  Speech.stop();
  Speech.speak(text, {
    language: "en-IN",
    rate: 0.95,
    pitch: 1.0,
  });
}

export function stopSpeaking(): void {
  Speech.stop();
}

export async function startListening(): Promise<void> {
  try {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    nativeRecordingInstance = recording;
  } catch (err) {
    console.log("Audio capture frame initialization fault:", err);
  }
}

export async function stopListening(): Promise<string | null> {
  if (!nativeRecordingInstance) return null;
  try {
    await nativeRecordingInstance.stopAndUnloadAsync();
    const uri = nativeRecordingInstance.getURI();
    nativeRecordingInstance = null;
    return uri; // Return absolute file path block for remote STT transcription
  } catch (e) {
    return null;
  }
}
