export default async function handler(req, res) {
  if (req.method === "GET") {
    // Return Razorpay key for frontend
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY || "";
    return res.status(200).json({ key });
  }

  if (req.method === "POST") {
    // Verify payment signature
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keySecret) {
      // No secret configured - just confirm payment
      return res.status(200).json({ success: true });
    }

    try {
      const crypto = await import("crypto");
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSig = crypto.default
        .createHmac("sha256", keySecret)
        .update(body)
        .digest("hex");
      
      if (expectedSig === razorpay_signature) {
        return res.status(200).json({ success: true, payment_id: razorpay_payment_id });
      } else {
        return res.status(400).json({ success: false, error: "Invalid signature" });
      }
    } catch(err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
