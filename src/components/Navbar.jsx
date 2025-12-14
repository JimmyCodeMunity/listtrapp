import {
  Cog,
  Search,
  Heart,
  User2Icon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { Dropdown } from "./ui/DropDown";
import { helpoptions, selloptions } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { CategoryDropDown } from "./ui/CategoryDropDown";
import { NotificationDropdown } from "./NotificationDropdown";
import { MessagesDropdown } from "./MessagesDropdown";
import { WishlistDrawer } from "./WishlistDrawer";

const Navbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const navigate = useNavigate();
  const { user, categories } = useAuth();
  const { wishlistCount } = useWishlist();

  const handleCategorySelect = (value) => {
    console.log("catv", value);
    navigate(`/marketplace?category=${value}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
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
    <div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-32 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
    
    <div
      className={`w-full relative max-w-7xl mx-auto md:px-6 px-4 bg-transparent py-4 sticky top-0 z-50 transition-all duration-300 `}
    >
      
      {/* Main Navbar Row */}
      <div className="w-full flex flex-col gap-3">
        {/* Top Row: Logo, Search, Icons */}
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-wider text-gray-900 hover:text-orange-500 transition-colors">
              Listtr
            </Link>
          </div>

          {/* Desktop Search Bar - Smooth Hide */}
          <form
            onSubmit={handleSearch}
            className={`flex-1 max-w-2xl text-xs transition-all duration-500 ease-in-out transform ${
              isSearchVisible
                && "opacity-100 translate-y-0"
            } overflow-hidden md:block hidden`}
          >
            <div className="w-full h-10 border border-gray-300 rounded-full flex flex-row items-center justify-between bg-gray-50 hover:bg-white hover:border-orange-400 transition-all focus-within:bg-white focus-within:border-orange-500 focus-within:shadow-md">
              <div className="flex flex-row items-center pl-4">
                <Search className="text-gray-400" size={18} />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full px-4 bg-transparent border-0 focus:outline-none text-sm"
                />
              </div>
              <div className="pr-1">
                <button 
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 h-8 px-6 rounded-full text-white font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Wishlist & Icons */}
          <div className="flex flex-row items-center md:gap-1 gap-1 text-xs flex-shrink-0">
            <div className="flex flex-row items-center gap-1 border-l border-gray-200 pl-3">
              {user && (
                <button
                  onClick={() => setIsWishlistOpen(true)}
                  className="flex items-center gap-1 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <Heart className="text-gray-600" size={18} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 text-xs text-white bg-orange-500 w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-700 hidden md:block">Wishlist</p>
                </button>
              )}
              
              {user && <MessagesDropdown />}
              {user && <NotificationDropdown />}
              
              {user ? (
                <Link
                  to="/profile/userinfo"
                  className="flex flex-row items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <User2Icon className="text-gray-600" size={18} />
                  <p className="text-xs font-medium text-gray-700 hidden md:block">Hi, {user?.user?.username}</p>
                </Link>
              ) : (
                <Link
                  to="/auth/signin"
                  className="flex flex-row items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <Cog className="text-gray-600" size={18} />
                  <p className="text-xs font-medium text-gray-700">Account</p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar - Also hides on scroll */}
        <form
          onSubmit={handleSearch}
          className={`px-0 w-full block md:hidden h-9 border border-gray-300 rounded-full flex flex-row items-center justify-between transition-all duration-200 ease-in-out transform bg-gray-50 ${
            isSearchVisible
              && "opacity-100 translate-y-0"
          } overflow-hidden`}
        >
          <div className="flex flex-row items-center pl-3">
            <Search className="text-gray-400" size={16} />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full px-3 bg-transparent border-0 focus:outline-none text-sm"
            />
          </div>
          <div className="pr-1">
            <button 
              type="submit"
              className="bg-orange-500 h-7 px-4 rounded-full text-white text-xs font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {/* Mini Nav - Always visible */}
        <div className="w-full flex flex-row justify-between items-center border-t border-gray-200 pt-3">
          <div className="flex flex-row md:justify-start justify-center gap-1 text-xs">
            <div className="px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <CategoryDropDown
                label="Categories"
                options={categories}
                onSelect={handleCategorySelect}
              />
            </div>
            <div className="px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Dropdown
                label="Sell on Listtr"
                options={selloptions}
                onSelect={(value) => console.log(value)}
              />
            </div>
            <Link 
              to="/boost-rates"
              className="md:block hidden px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-700 hover:text-orange-600"
            >
              Boost Ads
            </Link>
            <div className="md:block hidden px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <Dropdown
                label="Help"
                options={helpoptions}
                onSelect={(value) => console.log(value)}
              />
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <button
              onClick={() => navigate("/profile/ads?post=true")}
              className="bg-orange-500 hover:bg-orange-600 rounded-full py-2 px-5 text-white text-xs font-medium transition-colors shadow-sm hover:shadow-md"
            >
              Post Ad
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist Drawer */}
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
    </div>
  );
};

export default Navbar;
