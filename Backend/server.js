import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";

//App Config

const app = express(); //instance of the express server
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
console.log(process.env.CLOUDINARY_NAME);

//Middelwares
app.use(express.json()); //whatever req we will get, that will be passed using json
app.use(cors()); //we can access the backend from any IP

//API endpoints using the routers from routes folder
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log("Server started on port: " + port));
