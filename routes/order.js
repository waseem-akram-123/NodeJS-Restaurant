const express = require("express");
const router = express.Router();
const Menu = require("../models/menu");
const Order = require("../models/order");
const { sendSMS } = require("../services/smsService"); // ✅ Import Twilio SMS function

function generateOrderCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

router.post("/order", async (req, res) => {
  try {
    const { menuItemId } = req.body;
    const userId = req.user ? req.user._id : null; // ✅ req.user is added by authentication middleware

    if (!userId) {
      return res.status(401).send("You must be logged in to place an order");
    }

    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).send("Menu item not found");
    }

    const orderCode = generateOrderCode();

    const newOrder = await Order.create({
      user: userId,
      menuItem: menuItem._id,
      quantity: 1,
      orderCode: orderCode,
    });

    const populatedOrder = await newOrder.populate("user menuItem");

    // ✅ Send SMS if user's mobile number is present
    const mobile = populatedOrder.user.mobile;
    if (mobile) {
      const smsMessage = `Hi ${populatedOrder.user.username}, your order for "${populatedOrder.menuItem.name}" has been placed! Order Code: ${orderCode}`;
      try {
        await sendSMS(mobile.startsWith('+') ? mobile : `+91${mobile}`, smsMessage); // Add +91 if not included
        console.log("SMS sent to:", mobile);
      } catch (smsErr) {
        console.error("Error sending SMS:", smsErr.message);
      }
    }

    res.render("order", { order: populatedOrder, user: req.user });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
