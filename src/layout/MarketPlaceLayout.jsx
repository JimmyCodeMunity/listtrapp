import React from "react";
import Sidebar from "../components/Sidebar";

const MarketPlaceLayout = ({ children }) => {
  return (
    <div className="w-full font-poppins flex flex-row items-start space-x-6 mx-auto md:px-8 max-w-7xl">
      <div className="md:block hidden w-[20%]">
        <Sidebar />
      </div>
      <div className="md:w-[80%] w-full">{children}</div>
    </div>
  );
};

export default MarketPlaceLayout;
