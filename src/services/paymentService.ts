export const calculateSplit = (amount: number) => {
  const platformCut = amount * 0.3;
  const teacherEarning = amount * 0.7;

  return {
    platformCut,
    teacherEarning,
  };
};