import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "progress_data";

export async function getProgress() {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

export async function markLearned(topic: string) {
  const existing = await getProgress();

  if (!existing.includes(topic)) {
    existing.push(topic);
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(existing));
}

export async function clearProgress() {
  await AsyncStorage.removeItem(KEY);
}