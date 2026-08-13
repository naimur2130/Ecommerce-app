import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    //At first we need to store the image in cloudinary and after that in the mongoose DB we will upload the cloudinary url
    //after filtering, if any image field is empty then it will not push to the array

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes), //converting the string to array by using JSON.parse()
      image: imagesUrl,
      date: Date.now(),
    };
    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const totalProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products, message: "All Products fetched" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({
      success: true,
      product,
      message: "Product fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, totalProducts, deleteProduct, singleProduct };
