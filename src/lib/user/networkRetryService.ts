export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  backoffFactor: number;
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 1000,
  backoffFactor: 2,
};

/**
 * Executes a critical async operation with an exponential backoff retry mechanism [INDEX].
 */
export async function executeWithRetry<T>(
  task: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  let currentAttempt = 0;
  let delay = finalConfig.initialDelayMs;

  while (currentAttempt < finalConfig.maxRetries) {
    try {
      return await task();
    } catch (error) {
      currentAttempt++;
      console.log(`[RETRY SYSTEM] Attempt ${currentAttempt} failed. Parsing error profile...`);
      
      if (currentAttempt >= finalConfig.maxRetries) {
        throw new Error(`Operation aborted after ${finalConfig.maxRetries} unsuccessful attempts.`);
      }
      
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= finalConfig.backoffFactor;
    }
  }
  
  throw new Error("Unexpected retry loop termination state.");
}
