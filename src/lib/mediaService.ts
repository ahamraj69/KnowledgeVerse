export const getMediaType = (url: string) => {
  if (url.includes(".mp4")) return "video";
  if (url.includes(".pdf")) return "pdf";
  return "unknown";
};