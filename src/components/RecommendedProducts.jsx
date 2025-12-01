import React from "react";
import { products } from "../constants";
import ProductCard from "./ui/ProductCard";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AdCard from "./ui/AdCard";

const RecommendedProducts = () => {
  const { user, ads } = useAuth();
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 space-y-5">
      <div className="w-full flex flex-row justify-between items-center">
        <h2 className="text-2xl font-bold">Recommended Products</h2>
        <a
          href={`/marketplace`}
          className="text-sm font-semibold text-neutral-500"
        >
          See All
        </a>
      </div>
      {/* check if ads is not empty */}
      {ads.length > 0 ? (
        <div className="grid md:grid-cols-4 grid-cols-2 lg:grid-cols-4 md:gap-4 gap-2 justify-center">
          {ads.slice(0, 9).map((product) => (
            <AdCard
              state={product}
              path={`/product/${product._id}`}
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-row justify-center items-center">
          <p>No products found</p>
        </div>
      )}

      <div className="w-full py-6 flex justify-center">
        <button className="bg-orange-500 text-white px-4 py-2 rounded-full">
          Load More
        </button>
      </div>
    </div>
  );
};

export default RecommendedProducts;
