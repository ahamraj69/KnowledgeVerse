import RazorpayCheckout from "react-native-razorpay";
import { createPayment } from "./paymentService";
import { subscribeToCourse } from "./subscriptionService";

/**
 * 💳 REAL PAYMENT FLOW
 */
export const payForCourse = async (
  amount: number,
  courseId: string,
  teacherId: string
) => {
  return new Promise((resolve, reject) => {
    var options = {
      description: "Course Purchase",
      currency: "INR",
      amount: amount * 100, // paise
      name: "KnowledgeVerse",
      key: "YOUR_RAZORPAY_KEY", // replace later
      theme: { color: "#2563EB" },
    };

    RazorpayCheckout.open(options)
      .then(async (data: any) => {
        // PAYMENT SUCCESS

        await subscribeToCourse(courseId);
        await createPayment(teacherId, amount);

        resolve({
          success: true,
          paymentId: data.razorpay_payment_id,
        });
      })
      .catch((error: any) => {
        console.log("Payment Failed", error);
        reject(error);
      });
  });
};