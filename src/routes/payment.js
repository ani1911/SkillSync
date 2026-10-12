const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { userAuth } = require("../middlewares/auth");
const Payment = require("../models/payment");
const razorpayInstance = require("../utils/razorpay");

router.post("/payment/create-order", userAuth, async (req, res) => {
  try {
    if (req.user.isPremium) {
      return res.status(400).json({ message: "You are already a Pro member" });
    }

    const amount = 9900;
    const receipt = `rcpt_${req.user._id.toString().slice(-6)}_${Date.now()}`;
    const isMock = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === "rzp_test_placeholder";

    let order;
    if (isMock) {
      order = {
        id: `order_test_${Date.now()}`,
        amount,
        currency: "INR",
        receipt,
        notes: {
          userId: req.user._id.toString(),
          plan: "pro_membership",
        },
      };
    } else {
      order = await razorpayInstance.orders.create({
        amount,
        currency: "INR",
        receipt,
        notes: {
          userId: req.user._id.toString(),
          plan: "pro_membership",
        },
      });
    }

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "created",
      receipt: order.receipt,
    });
    await payment.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: isMock ? "rzp_test_demo" : process.env.RAZORPAY_KEY_ID,
      isMock,
      notes: order.notes,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to create payment order", error: err.message });
  }
});

router.post("/payment/verify", userAuth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required payment details" });
    }

    const isMock = razorpay_order_id.startsWith("order_test_");

    if (!isMock) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const isMatch = crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature)
      );

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
    }

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    if (payment) {
      payment.status = "captured";
      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      await payment.save();
    }

    req.user.isPremium = true;
    const updatedUser = await req.user.save();
    const { password, ...safeUser } = updatedUser.toObject();

    res.json({
      message: "Payment verified successfully",
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
});

router.get("/payment/status", userAuth, async (req, res) => {
  try {
    res.json({ isPremium: !!req.user.isPremium });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch status", error: err.message });
  }
});

module.exports = router;
