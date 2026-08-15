import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  //As we have use path="/product/productId" in the route. So we have to use the same "productId"
  const { productId } = useParams(); //It will get the productId from the url
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };
  useEffect(() => {
    fetchProductData();
  }, [productId]);
  return productData ? (
    <div className="border-t pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 shrink-0 crurson-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* product Information */}
        <div className="flex-1 ">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star} alt="" className="w-5 h-5 5" />
            <img src={assets.star} alt="" className="w-5 h-5 5" />
            <img src={assets.star} alt="" className="w-5 h-5 5" />
            <img src={assets.star} alt="" className="w-5 h-5 5" />
            <img src={assets.half_star} alt="" className="w-5 h-5 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium text-mauve-600">
            {currency} {productData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => {
                    setSize(size === item ? "" : item);
                  }}
                  className={`border py-2 px-4 bg-gray-200 ${item === size ? "bg-green-500" : "bg-gray-200"}`}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              addToCart(productData._id, size);
            }}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
            <p>Cash on delivary is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
      {/* Description & review Section */}
      <div className="mt-20">
        <div className="flex">
          <p className="border px-5 py-3 text-sm">Description</p>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable. If you are going to use a passage of Lorem Ipsum, you
            need to be sure there isn't anything embarrassing hidden in the
            middle of text. All the Lorem Ipsum generators on the Internet tend
            to repeat predefined chunks as necessary, making this the first true
            generator on the Internet. It uses a dictionary of over 200 Latin
            words, combined with a handful of model sentence structures, to
            generate Lorem Ipsum which looks reasonable. The generated Lorem
            Ipsum is therefore always free from repetition, injected humour, or
            non-characteristic words etc.
          </p>
          <p>
            The standard chunk of Lorem Ipsum used since 1966 is reproduced
            below for those interested. Sections 1.10.32 and 1.10.33 from "de
            Finibus Bonorum et Malorum" by Cicero are also reproduced in their
            exact original form, accompanied by English versions from the 1914
            translation by H. Rackham.
          </p>
        </div>
      </div>
      {/* Show Related Products */}

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
