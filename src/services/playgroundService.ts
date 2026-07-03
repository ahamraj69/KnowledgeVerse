export interface RunResult {
  output: string;
  error?: string;
}

/**
 * 🧪 Simple JS Runner (Mock Engine)
 * Later can be replaced with:
 * - Judge0 API
 * - Firebase Function runner
 * - Backend container execution
 */
export const runCode = async (
  code: string
): Promise<RunResult> => {
  try {
    // SAFE SIMULATION ONLY (no eval in production)
    // We'll simulate output parsing

    let output = "";

    const consoleLog = (...args: any[]) => {
      output += args.join(" ") + "\n";
    };

    // Fake execution environment
    const func = new Function(
      "console",
      code
    );

    func({ log: consoleLog });

    return {
      output:
        output || "Code executed successfully",
    };
  } catch (error: any) {
    return {
      output: "",
      error: error.message,
    };
  }
};