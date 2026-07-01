import { Alert } from "react-native";
import { calculateSplit } from "./paymentService";

/**
 * ⚠️ MOCK FLOW (REAL RAZORPAY WILL COME NEXT PHASE)
 */
export const startPayment = async (amount: number, teacherId: string) => {
  try {
    const split = calculateSplit(amount);

    // Simulate payment success
    Alert.alert(
      "Payment Successful",
      `Paid ₹${amount}\nTeacher: ₹${split.teacherEarning}\nPlatform: ₹${split.platformCut}`
    );

    return {
      success: true,
      ...split,
    };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};