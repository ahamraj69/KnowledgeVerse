export const EncryptionConstants = {
  ALGORITHM: "AES-GCM",
  KEY_SIZE_BITS: 256,
  KEY_ROTATION_INTERVAL_DAYS: 90,
  SECURE_STORE_PREFIX: "knowledgeverse_secure_lock_"
} as const;

export type DataProtectionLevel = "PUBLIC" | "PROTECTED" | "HIGHLY_SENSITIVE";
