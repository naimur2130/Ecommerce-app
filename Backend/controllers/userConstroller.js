//Route for user Login
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await userModel.findOne({ email });
    if (!userExist) {
      res.json({
        success: false,
        message: "User does not exist. Please create an account.",
      });
    }
    const isMatched = await bcrypt.compare(password, userExist.password);
    if (!isMatched) {
      res.json({ success: false, message: "Wrong user information" });
    }
    const token = createToken(userExist._id);
    res.json({ success: true, token, message: "Login successful!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for user Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //checking if user already exists
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    //Validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    //Hashing user Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token, message: "Registration successful!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      !email === process.env.ADMIN_EMAIL &&
      !password === process.env.ADMIN_PASSWORD
    ) {
      res.json({ success: false, message: "Incorrect Admin Information" });
    }
    const token = jwt.sign(email + password, process.env.JWT_SECRET);
    res.json({ success: true, token, message: "Login Successful" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
