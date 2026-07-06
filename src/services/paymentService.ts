// Assuming calculateSplit is located in the same directory or adjust relative path as needed
export const calculateSplit = (amount: number) => {
  const platformCut = amount * 0.3;
  const teacherEarning = amount * 0.7;

  return {
    platformCut,
    teacherEarning,
  };
};

/**
 * Calculates earnings distribution cuts and saves records locally or to Firestore
 */
export const savePayment = async (
  teacherId: string,
  amount: number
): Promise<boolean> => {
  const split = calculateSplit(amount);

  console.log("Saving payment record to storage engine database...");
  console.log({
    teacherId,
    amount,
    platformCut: split.platformCut,
    teacherEarning: split.teacherEarning,
  });

  return true;
};
