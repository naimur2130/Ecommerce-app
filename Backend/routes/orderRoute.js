import express from "express";
import {
  placeOrder,
  placeOrderRazorPay,
  placeOrderStripe,
  displayAllOrders,
  userOrders,
  verifyStripe,
  updateStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js";
const orderRouter = express.Router();

//for admin
orderRouter.post("/list", adminAuth, displayAllOrders);
orderRouter.post("/status", adminAuth, updateStatus);
//for users
orderRouter.post("/place", auth, placeOrder);
orderRouter.post("/stripe", auth, placeOrderStripe);
orderRouter.post("/razorpay", auth, placeOrderRazorPay);
orderRouter.post("/userorders", auth, userOrders);

orderRouter.post("/verifystripe", auth, verifyStripe);

export default orderRouter;
