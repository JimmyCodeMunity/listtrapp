import {
  Bell,
  ChevronDown,
  Cog,
  MapPin,
  MessageCircle,
  Search,
  ShoppingBag,
} from "lucide-react";
import React, { useContext, useState, useEffect } from "react";
import { Dropdown } from "./ui/DropDown";
import { helpoptions, selloptions } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CategoryDropDown } from "./ui/CategoryDropDown";
import { Button } from "./ui/Button";

const Navbar = () => {
  const [selectedFilter, setSelectedFilter] = useState("Categories");
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const { user, categories } = useAuth();

  const handleCategorySelect = (value) => {
    console.log("catv", value);
    navigate(`/marketplace?category=${value}`);
    setSelectedFilter(value);
  };

  // Control visibility based on scroll direction and position
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Hide search bar when scrolled down past 100px
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsSearchVisible(false);
      }
      // Show when scrolling up or at top
      else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setIsSearchVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    // Cleanup
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  return (
    <div
      className={`w-full max-w-7xl mx-auto md:px-6 px-4 bg-white py-5 sticky top-0 z-50 transition-all duration-300`}
    >
      {/* Main Navbar Row */}
      <div className="w-full flex flex-col gap-4">
        {/* Top Row: Logo, Search, Icons */}
        <div className="w-full flex flex-row items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold tracking-wider">
              Littr
            </Link>
          </div>

          {/* Desktop Search Bar - Smooth Hide */}
          <Link
            to="/search"
            className={`w-[60%] text-xs transition-all duration-500 ease-in-out transform ${
              isSearchVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 h-0"
            } overflow-hidden md:block hidden`}
          >
            <div className="w-full h-8 border border-neutral-200 rounded-full flex flex-row items-center justify-between">
              <div className="flex flex-row items-center">
                <div className="border border-l-0 border-t-0 border-b-0 border-neutral-300 h-full px-4 flex flex-row items-center space-x-2">
                  <Search color="gray" size={20} />
                </div>
              </div>
              <div className="w-full">
                <input
                  type="text"
                  placeholder="Asus"
                  className="h-14 w-full px-4 bg-transparent border-0 focus:outline-none"
                />
              </div>
              <div>
                <button className="bg-orange-500 h-8 w-32 rounded-full text-white">
                  Search
                </button>
              </div>
            </div>
          </Link>

          {/* Cart & Icons */}
          <div className="flex flex-row items-center md:space-x-4 space-x-2 text-xs">
            <div className="flex flex-row items-center space-x-2 border border-l-0 border-t-0 border-b-0 border-neutral-200 md:px-4">
              <div className="space-x-3 flex items-center">
                <div className="relative cursor-pointer">
                  <ShoppingBag color="grey" size={15} />
                  <button className="absolute -top-2 -right-3 text-xs text-white bg-orange-500 w-[18px] h-[18px] rounded-full">
                    3
                  </button>
                </div>
                <p className="text-xs">Cart</p>
              </div>
              <Link to="/chats" className="flex items-center space-x-1">
                <MessageCircle color="grey" size={15} />
                <p className="text-xs">Messages</p>
              </Link>
              <Bell color="grey" size={15} />
              <p className="text-xs">Notifications</p>
              {user ? (
                <Link
                  to="/profile/userinfo"
                  className="flex flex-row items-center space-x-2"
                >
                  <Cog color="grey" size={15} />
                  <p className="text-xs">Account</p>
                </Link>
              ) : (
                <Link
                  to="/auth/signin"
                  className="flex flex-row items-center space-x-2"
                >
                  <Cog color="grey" size={15} />
                  <p className="text-xs">Account</p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Also hides on scroll */}
        <div
          className={`px-0 w-full my-4 block md:hidden h-6 border border-neutral-200 rounded-full flex flex-row items-center justify-between transition-all duration-200 ease-in-out transform ${
            isSearchVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 h-0"
          } overflow-hidden`}
        >
          <div className="flex flex-row items-center">
            <div className="border border-l-0 border-t-0 border-b-0 border-neutral-300 h-full px-4 flex flex-row items-center space-x-2">
              <CategoryDropDown
                label="Categories"
                options={categories}
                onSelect={handleCategorySelect}
              />
            </div>
          </div>
          <div className="w-full">
            <input
              type="text"
              placeholder="Asus"
              className="h-6 w-full px-4 bg-transparent border-0 focus:outline-none"
            />
          </div>
          <div>
            <button className="bg-orange-500 h-6 w-24 rounded-full text-white">
              Search
            </button>
          </div>
        </div>

        {/* Mini Nav - Always visible */}
        <div className="w-full flex flex-row justify-between items-center">
          <div className="w-full text-xs flex flex-row md:justify-start justify-center border border-neutral-200 border-b-0 border-r-0 border-l-0 py-4">
            <div className="border border-l-0 border-b-0 border-t-0 border-neutral-400 px-5">
              <CategoryDropDown
                label="Categories"
                options={categories}
                onSelect={handleCategorySelect}
              />
            </div>
            <div className="border border-l-0 border-b-0 border-t-0 border-neutral-400 px-5">
              <Dropdown
                label="Sell on Littr"
                options={selloptions}
                onSelect={(value) => console.log(value)}
              />
            </div>
            <div className="border md:block hidden border-l-0 border-b-0 border-t-0 border-neutral-400 px-5">
              <Dropdown
                label="Help"
                options={helpoptions}
                onSelect={(value) => console.log(value)}
              />
            </div>
          </div>
          <div className="w-full flex flex-row justify-end">
            <button
              onClick={() => navigate("/profile/ads?post=true")}
              className="bg-orange-500 rounded-full py-2 px-4 text-white text-xs"
            >
              Post Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
