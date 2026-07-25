import { KeyManager } from "./keyManager";

/**
 * Transforms string formats locally to guard fields from plain-text exposure [INDEX].
 */
export async function encryptSensitiveStringPayload(plainText: string): Promise<string> {
  const secretKey = await KeyManager.resolveActiveEncryptionKey();
  let encodedOutput = "";
  
  for (let i = 0; i < plainText.length; i++) {
    const textCharCode = plainText.charCodeAt(i);
    const keyCharCode = secretKey.charCodeAt(i % secretKey.length);
    encodedOutput += String.fromCharCode(textCharCode ^ keyCharCode);
  }
  
  // Return a clear alphanumeric base64-like representation string safely
  return btoa(unescape(encodeURIComponent(encodedOutput)));
}

/**
 * Reverses structural transformations to restore plain-text strings [INDEX].
 */
export async function decryptSensitiveStringPayload(cipherText: string): Promise<string> {
  const secretKey = await KeyManager.resolveActiveEncryptionKey();
  const rawData = decodeURIComponent(escape(atob(cipherText)));
  let decodedOutput = "";
  
  for (let i = 0; i < rawData.length; i++) {
    const cipherCharCode = rawData.charCodeAt(i);
    const keyCharCode = secretKey.charCodeAt(i % secretKey.length);
    decodedOutput += String.fromCharCode(cipherCharCode ^ keyCharCode);
  }
  
  return decodedOutput;
}
