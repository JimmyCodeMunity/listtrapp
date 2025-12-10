import {
  HeartIcon,
  HomeIcon,
  LayoutDashboard,
  ShoppingBag,
  UserIcon,
} from "lucide-react";
import React from "react";

const BottomTab = () => {
  return (
    <div>
      <div className="md:hidden block w-full fixed bottom-0 left-0 right-0 h-16 bg-white border border-neutral-200 border-l-0 border-r-0 border-b-0">
        <div className="flex flex-row items-center justify-between px-2 w-full h-full">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <HomeIcon size={20} color="grey" />
            <p className="text-neutral-500 text-xs">Home</p>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <LayoutDashboard size={20} color="grey" />
            <p className="text-neutral-500 text-xs">Categories</p>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <ShoppingBag size={20} color="grey" />
            <p className="text-neutral-500 text-xs">Cart</p>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <HeartIcon size={20} color="grey" />
            <p className="text-neutral-500 text-xs">Wishlist</p>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <UserIcon size={20} color="grey" />
            <p className="text-neutral-500 text-xs">Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomTab;
