import {
  HeartIcon,
  HomeIcon,
  LayoutDashboard,
  MessageCircle,
  ShoppingBag,
  UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import { WishlistDrawer } from "./WishlistDrawer";
import { Link } from "react-router-dom";

const BottomTab = () => {
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
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
          <Link to="/chats" className="w-full h-full flex flex-col items-center justify-center">
            <MessageCircle size={20} color="grey" />
            <p className="text-neutral-500 text-xs">Chats</p>
          </Link>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <button className="w-full h-full flex flex-col items-center justify-center" onClick={() => setIsWishlistOpen(true)}>
              <HeartIcon size={20} color="grey" />
            <p className="text-neutral-500 text-xs">Wishlist</p>
            </button>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center">
            <UserIcon size={20} color="grey" />
            <p className="text-neutral-500 text-xs">Profile</p>
          </div>
        </div>
      </div>
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
};

export default BottomTab;
