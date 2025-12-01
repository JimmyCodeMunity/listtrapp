import React from "react";

const Sidebar = () => {
  return (
    <div className="w-full rounded-xl h-screen bg-white border border-neutral-100 p-5">
      <p className="text-lg font-semibold">Filter</p>

      <div className="py-5 space-y-3">
        <p className="text-neutral-500 text-sm">Product Types</p>
        <div className="flex flex-row items-center space-x-4">
          <input type="checkbox" className="w-5 h-5 border border-orange-200" />
          <p className="text-xs">Ready to ship</p>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input type="checkbox" className="w-5 h-5 border border-orange-200" />
          <p className="text-xs">For sale</p>
        </div>
      </div>
      <div className="py-5 space-y-3">
        <p className="text-neutral-500">Condition</p>
        <div className="flex flex-row items-center space-x-4">
          <input type="checkbox" className="w-5 h-5 border border-orange-200" />
          <p className="text-xs">New</p>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input type="checkbox" className="w-5 h-5 border border-orange-200" />
          <p className="text-xs">Used</p>
        </div>
      </div>
      <div className="py-5 space-y-3">
        <p className="text-neutral-500 text-sm">Product Types</p>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="radio"
            name="range"
            className="w-5 h-5 border border-orange-200"
          />
          <p className="text-xs">Below 1000</p>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="radio"
            name="range"
            className="w-5 h-5 border border-orange-200"
          />
          <p className="text-xs">1000 - 5000</p>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="radio"
            name="range"
            className="w-5 h-5 border border-orange-200"
          />
          <p className="text-xs">5000 - 10000</p>
        </div>
        <div className="flex flex-row items-center space-x-4">
          <input
            type="radio"
            name="range"
            className="w-5 h-5 border border-orange-200"
          />
          <p className="text-xs">Above 10000</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
