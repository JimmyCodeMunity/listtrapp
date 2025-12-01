import { ShoppingBagIcon } from "lucide-react";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="w-full h-screen  flex items-center justify-center">
      <div className="loader flex flex-row justify-center items-center">
        <ShoppingBagIcon size={25} color="black" />
      </div>
    </div>
  );
};

export default LoadingPage;
