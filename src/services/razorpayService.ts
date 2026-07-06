import RazorpayCheckout from "react-native-razorpay";
import { savePayment } from "./paymentService"; // ✅ FIX: Swapped undefined createPayment import with your exported savePayment function
import { subscribeToCourse } from "./subscriptionService";

/**
 * 💳 REAL PAYMENT FLOW
 */
export const payForCourse = async (
  amount: number,
  courseId: string,
  teacherId: string
): Promise<{ success: boolean; paymentId: string }> => {
  return new Promise((resolve, reject) => {
    const options = {
      description: "Course Purchase",
      currency: "INR",
      amount: amount * 100, // conversion to paise
      name: "KnowledgeVerse",
      key: "YOUR_RAZORPAY_KEY", // Replace with your active dashboard credentials key later
      theme: { color: "#2563EB" },
    };

    RazorpayCheckout.open(options)
      .then(async (data: any) => {
        // PAYMENT SUCCESS PIPELINE
        try {
          await subscribeToCourse(courseId);
          
          // ✅ FIX: Repointed internal callback trigger to savePayment to clear missing member compiler issues
          await savePayment(teacherId, amount);

          resolve({
            success: true,
            paymentId: data.razorpay_payment_id,
          });
        } catch (dbError) {
          console.log("Database subscription update failed:", dbError);
          reject(dbError);
        }
      })
      .catch((error: any) => {
        console.log("Payment Failed", error);
        reject(error);
      });
  });
};
