const express = require("express");
const router = express.Router();
const Payment = require("../model/payment"); 
const axios = require("axios");

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

// Initialize payment route
router.post("/accept-payment", async (req, res) => {
  const {
    amount,
    currency,
    email,
    first_name,
    last_name,
    phone_number,
    tx_ref,
  } = req.body;

  console.log("🔐 Incoming Payment Request:", req.body); // 👈 Add this

  try {
    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency,
        email,
        first_name,
        last_name,
        phone_number,
        tx_ref,
        return_url: "http://localhost:5173/payment-success",
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Chapa init response:", chapaRes.data);
    res.status(200).json(chapaRes.data);
  } catch (err) {
    console.error("❌ Chapa error:", err.response?.data || err.message); // 👈 Add this
    res.status(400).json({ message: err.message, chapa: err.response?.data });
  }
});


// Webhook route if success we will update the user baalce in our db
router.post("/webhook", express.json(), async (req, res) => {
  const data = req.body;

  if (data.status === "success") {
    const { tx_ref, amount, email } = data;

    await Payment.findOneAndUpdate(
      { tx_ref },
      { email, amount, status: "success" },
      { upsert: true }
    );

    console.log(`✅ Webhook received: Payment success for ${tx_ref}`);
  } else {
    console.log("❌ Webhook received but status is not success");
  }

  res.sendStatus(200);
});

// Check payment status route
router.get("/check-payment/:tx_ref", async (req, res) => {
  try {
    const tx = await Payment.findOne({ tx_ref: req.params.tx_ref });
    if (!tx) return res.json({ status: "pending" });
    res.json({ status: tx.status });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
