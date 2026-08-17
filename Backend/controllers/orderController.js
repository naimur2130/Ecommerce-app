import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

//Placing order using Cash on delivery method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Placing order using Stripe Method
const placeOrderStripe = async (req, res) => {};

//placing order using razor pay method

const placeOrderRazorPay = async (req, res) => {};

//Display all the orders for admin panel
const displayAllOrders = async (req, res) => {};

//User specific Order data
const userOrders = async (req, res) => {};

//Update Order Status from admin panel
const updateStatus = async (req, res) => {};

export {
  placeOrder,
  placeOrderRazorPay,
  placeOrderStripe,
  displayAllOrders,
  userOrders,
  updateStatus,
};
