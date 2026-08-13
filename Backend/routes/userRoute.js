import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
} from "../controllers/userConstroller.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser); //whenever the post req is from this "/register" path then it execute registerUser function
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

export default userRouter;
