import React from "react";
import { deals } from "../constants";

const DealsSection = () => {
  return (
    <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-4 md:h-[40vh] h-[60vh]">
      {deals.map((deal) => {
        return (
          <div
            className={`w-full h-full ${deal?.bg} rounded-md px-5 pt-6 relative`}
          >
            <div className="w-full flex flex-col space-y-5 justify-between h-full">
              <div className="w-full md:space-y-3 space-y-1 max-w-[70%]">
                <h2 className={`md:text-3xl text-lg font-semibold ${deal?.textcolor}`}>
                  {deal.title}
                </h2>
                <p className={`text-sm ${deal?.textcolor}`}>
                  {deal?.description}
                </p>
              </div>
              <div className="absolute bottom-0 right-0">
                <img src={deal?.image} className="md:h-60 h-20" alt="" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealsSection;
