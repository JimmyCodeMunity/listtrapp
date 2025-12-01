import React, { useState } from "react";
import AppLayout from "../layout/AppLayout";
import { useLocation } from "react-router-dom";
import BreadCrump from "../components/ui/BreadCrump";
import { p } from "framer-motion/client";
import { Link } from "react-router";
import { MessageCircle, PhoneCall } from "lucide-react";

const ProductView = () => {
  const location = useLocation();
  const product = location.state;
  // console.log("product", product);
  const [mainImage, setMainImage] = useState(product?.images?.[0]); // default main image
  const [activeIndex, setActiveIndex] = useState(0); // track active thumbnail
  const url = import.meta.env.VITE_WS_URL;
  return (
    <div className="">
      <AppLayout>
        <BreadCrump
          home="Home"
          category={product?.category?.categoryname}
          subcategory={product?.subcategory?.subcategoryname}
          productname={product?.title}
        />

        {/* product view */}
        <div className="w-full max-w-7xl mx-auto px-8 py-4">
          <div className="w-full grid grid-cols-2 sm:py-4 py-4">
            <div className="w-full h-full bg-white rounded-xl p-3 flex flex-row items-start gap-4">
              <div className="w-[20%] space-y-2">
                {product?.images?.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setMainImage(img);
                      setActiveIndex(index);
                    }}
                    className={`bg-transparent border overflow-hidden border-neutral-100 rounded-xl h-24 w-full flex items-center justify-center cursor-pointer ${
                      activeIndex === index ? "ring-2 ring-orange-500" : ""
                    }`}
                  >
                    <img
                      src={`${url}/${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="w-[80%] border border-neutral-100 rounded-xl overflow-hidden">
                <img 
                  src={`${url}/${mainImage}`} 
                  alt="Product"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=No+Image';
                  }}
                />
              </div>
            </div>
            <div className="w-full h-full p-5 flex flex-col items-start space-y-4">
              <h2 className="text-2xl font-bold">{product?.title}</h2>
              <h2 className="text-2xl font-semibold">
                {" "}
                Kshs.{product?.price?.toLocaleString()}
              </h2>
              <p className="text-neutral-500 text-xs">{product?.description}</p>
              <div className="w-full grid grid-cols-2 gap-4 py-5">
                {product?.subcategory?.features?.map((feat) => (
                  <div
                    key={feat.key}
                    className="w-full flex flex-col gap-2 items-start"
                  >
                    <p className="font-medium text-sm">{feat.label}:</p>
                    <p className="text-neutral-600 text-xs">
                      {product?.featureValues?.[feat.key] || "N/A"}
                    </p>
                  </div>
                ))}
              </div>

              {/* seller card */}
              <div className="w-full ring-1 ring-neutral-100 shadow-sm min-h-32 rounded-xl p-3 flex flex-row items-center justify-between">
                <div className="w-full flex flex-row items-center space-x-4">
                  <Link
                    to={`/shop/${product?.author?.username}`}
                    state={product?.author}
                    className="h-12 w-12 rounded-full flex flex-row items-center justify-center bg-black"
                  >
                    <p className="text-2xl font-bold text-white">
                      {product?.author?.username?.slice(0, 1)}
                    </p>
                  </Link>
                  <div>
                    <p className="text-xl">{product?.author?.username}</p>
                  </div>
                </div>
                <div className="w-full">
                  <div className="h-12 w-12 rounded-full flex flex-row items-center justify-center bg-orange-500">
                    <PhoneCall size={20} color="white" />
                  </div>
                </div>
                <div className="w-full">
                  <div className="h-12 w-12 rounded-full flex flex-row items-center justify-center bg-neutral-200">
                    <MessageCircle size={20} color="black" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* product properties */}
          {/* <div className="h-[30vh] w-full border border-neutral-100 rounded-xl shadow-sm"></div> */}
        </div>
      </AppLayout>
    </div>
  );
};

export default ProductView;
