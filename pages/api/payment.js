// pages/api/payment.js
// Razorpay payment verification endpoint

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) return res.status(500).json({ error: "Razorpay not configured" });

  try {
    const crypto = await import("crypto");
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .default.createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.status(200).json({ success: true, payment_id: razorpay_payment_id });
    } else {
      return res.status(400).json({ success: false, error: "Payment verification failed" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
