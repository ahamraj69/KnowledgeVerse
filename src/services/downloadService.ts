import AsyncStorage from "@react-native-async-storage/async-storage";

export interface DownloadItem {
  id: string;
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  videoUrl: string;
  downloadedAt: number;
}

/**
 * Storage Key
 */
const DOWNLOAD_KEY = "downloads";

/**
 * Get all downloads
 */
export const getDownloads = async (): Promise<
  DownloadItem[]
> => {
  const data = await AsyncStorage.getItem(DOWNLOAD_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Add download
 */
export const addDownload = async (
  item: DownloadItem
) => {
  const existing = await getDownloads();

  const updated = [
    ...existing,
    {
      ...item,
      downloadedAt: Date.now(),
    },
  ];

  await AsyncStorage.setItem(
    DOWNLOAD_KEY,
    JSON.stringify(updated)
  );

  return updated;
};

/**
 * Remove download
 */
export const removeDownload = async (
  lessonId: string
) => {
  const existing = await getDownloads();

  const updated = existing.filter(
    (item) => item.lessonId !== lessonId
  );

  await AsyncStorage.setItem(
    DOWNLOAD_KEY,
    JSON.stringify(updated)
  );

  return updated;
};

/**
 * Check if downloaded
 */
export const isDownloaded = async (
  lessonId: string
) => {
  const existing = await getDownloads();

  return existing.some(
    (item) => item.lessonId === lessonId
  );
};