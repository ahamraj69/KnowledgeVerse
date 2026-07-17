import RazorpayCheckout from "react-native-razorpay";
// ✅ FIXED: Using your exact exported database logger function reference smoothly
import { savePayment } from "./paymentService";

/**
 * 💳 Razorpay Core Transaction Gateway Engine Pipeline
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
      amount: amount * 100, // Conversion from Rupees to Paise tracking indices
      name: "KnowledgeVerse",
      key: "YOUR_RAZORPAY_KEY", // Replace with your active live dashboard credentials key later
      theme: { color: "#2563EB" },
    };

    RazorpayCheckout.open(options)
      .then(async (data: any) => {
        // PAYMENT SUCCESS PIPELINE
        try {
          // ✅ FIXED: Replaced legacy non-existent function with clear task roadmap pointers
          // TODO:
          // After successful payment,
          // unlock the purchased course.
          //
          // This will be implemented in
          // the Premium Membership / Purchase
          // system (Phase 46).

          await savePayment(teacherId, amount);

          resolve({
            success: true,
            paymentId: data.razorpay_payment_id,
          });
        } catch (dbError) {
          console.log("Database update tracking failed:", dbError);
          reject(dbError);
        }
      })
      .catch((error: any) => {
        console.log("Payment Gateway Transaction Failed:", error);
        reject(error);
      });
  });
};
