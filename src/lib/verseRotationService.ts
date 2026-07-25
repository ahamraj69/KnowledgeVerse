import { versesEN } from "@/data/verses.en";
import { Verse } from "@/types/verse";

/**
 * Computes a deterministic date hash to rotate verses through distinct categories [INDEX].
 */
export function getSmartRotatedVerse(): Verse {
  const dataset = versesEN.length > 0 ? versesEN : [];
  if (dataset.length === 0) {
    return { id: "err_fallback", title: "Keep Scaling", message: "Consistency builds architectural mastery daily.", category: "learning" };
  }

  const currentTimestamp = Date.now();
  const dayIndexOffset = Math.floor(currentTimestamp / (1000 * 60 * 60 * 24));
  
  // Deterministic selector handles small collections gracefully by cycling array bounds
  const targetIndex = dayIndexOffset % dataset.length;
  return dataset[targetIndex];
}
