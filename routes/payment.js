require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();

router.post("/orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = req.body;

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/validate", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body; //get from client side

    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex"); // it have rozarpay signature

    if (digest !== razorpay_signature) {
      //if server signature does not match with client signature, give error
      return res.status(404).json({ message: "Transaction not legit!" });
    }

    res.json({
      message: "Successfull",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    }); //if matched, then send message, orderid and paymentid to client
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;
