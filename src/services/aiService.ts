// 🌐 Replace this IP string with your current machine's local network IP address
// Example: "http://10.215.179.23:5000/chat"
const API_URL = "http://10.215.179.23:5000/chat";

/**
 * Dispatches an analytical payload text message string over a secure REST link gateway 
 * to your running Flask microservice environment.
 * 
 * @param message Explicit situational context payload query or orchestration instruction prompt map
 * @returns Synchronous string response representing the derived AI text translation
 */
export async function sendMessage(message: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to contact AI Engine Server. Status: ${response.status}`);
  }

  const data = await response.json();

  // Returns the precise string body sent back through your endpoint wrapper
  return data.reply;
}
