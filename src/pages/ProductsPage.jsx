// src/pages/ProductsPage.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import AppLayout from "../layout/AppLayout";
import MarketPlaceLayout from "../layout/MarketPlaceLayout";
import { filteroptions } from "../constants";
import { Dropdown } from "../components/ui/DropDown";
import AdCard from "../components/ui/AdCard";
import { useLocation } from "react-router-dom";
import BreadCrump from "../components/ui/BreadCrump";
import { useAuth } from "../context/AuthContext";
import { Search, X } from "lucide-react";

const ProductsPage = () => {
  const { ads } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [activeFilters, setActiveFilters] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Get current category
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  // MEMOIZE categoryAds to prevent unnecessary re-renders
  const categoryAds = useMemo(() => {
    return ads.filter((ad) => ad?.category?.categoryname === category);
  }, [ads, category]); // Only recompute if ads or category changes

  // === SUGGESTIONS (safe now) ===
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = categoryAds
        .filter((ad) =>
          ad.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, categoryAds]); // Safe: categoryAds is memoized

  // === CLOSE DROPDOWN ON OUTSIDE CLICK ===
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // === HANDLE SEARCH ===
  const performSearch = (term = searchQuery) => {
    const trimmed = term.trim();
    if (trimmed) {
      setSearchTerm(trimmed);
    } else {
      setSearchTerm("");
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      performSearch();
    }
  };

  const handleSuggestionClick = (ad) => {
    setSearchQuery(ad.title);
    performSearch(ad.title);
    searchInputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchTerm("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  // === FINAL FILTERED PRODUCTS ===
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return categoryAds;
    return categoryAds.filter((ad) =>
      ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoryAds, searchTerm]);

  return (
    <div>
      <AppLayout>
        <BreadCrump home="Home" category={category || null} productname={""} />
        <MarketPlaceLayout>
          {/* Search Bar */}
          <div className="w-full md:mb-6 mb-3 relative">
            <div className="w-full h-8 border border-neutral-200 rounded-full flex flex-row items-center justify-between overflow-hidden">
              <div className="flex flex-row items-center">
                <div className="border border-l-0 border-t-0 border-b-0 border-neutral-300 h-full px-4 flex items-center">
                  <Search color="gray" size={20} />
                </div>
              </div>

              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Search in ${category || "All Categories"}`}
                  className="h-14 w-full px-4 bg-transparent border-0 focus:outline-none text-sm"
                />
              </div>

              <div>
                {searchQuery ? (
                  <button
                    onClick={clearSearch}
                    className="bg-orange-500 h-8 w-32 rounded-full text-white text-sm font-medium"
                  >
                    Clear
                  </button>
                ) : (
                  <button
                    onClick={() => searchQuery.trim() && performSearch()}
                    className="bg-black h-8 w-32 rounded-full text-white text-sm font-medium"
                  >
                    Search
                  </button>
                )}
              </div>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {suggestions.map((ad) => (
                  <div
                    key={ad._id}
                    onClick={() => handleSuggestionClick(ad)}
                    className="px-4 py-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-100 last:border-b-0 flex items-center space-x-3"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {ad.images?.[0] ? (
                        <img
                          src={`${import.meta.env.VITE_WS_URL}/${ad.images[0]}`}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">
                        {ad.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {ad.price ? `KSh ${ad.price}` : "No price"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sort & Filters */}
          <div className="w-full md:px-0 px-4 flex flex-row items-center justify-between mb-4">
            <div />
            <div className="flex flex-row items-center space-x-3">
              <p className="text-neutral-500 text-sm">Sort by</p>
              <Dropdown
                label="Select"
                options={filteroptions}
                selected={selectedFilter}
                onSelect={(option) => {
                  setSelectedFilter(option.name || option);
                  if (!activeFilters.includes(option)) {
                    setActiveFilters((prev) => [...prev, option]);
                  }
                }}
                direction="left"
              />
            </div>
          </div>

          {/* Active Filters */}
          <div className="w-full md:px-0 px-4 flex flex-wrap gap-2 py-3">
            {activeFilters.map((filter, idx) => (
              <div
                key={idx}
                onClick={() =>
                  setActiveFilters((prev) => prev.filter((f) => f !== filter))
                }
                className="rounded-3xl border border-neutral-400 h-8 px-4 flex items-center cursor-pointer hover:bg-neutral-100 text-sm text-neutral-700"
              >
                {filter.name || filter}
                <X size={14} className="ml-2" />
              </div>
            ))}
          </div>

          {/* Products Grid */}
          <div className="w-full md:px-0 px-4">
            {filteredProducts.length === 0 ? (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} color="gray" />
                </div>
                <h2 className="text-xl font-semibold text-neutral-600">
                  {searchTerm
                    ? `No results for "${searchTerm}"`
                    : "No Products Found"}
                </h2>
                <p className="text-neutral-400 text-sm mt-2 max-w-md">
                  {searchTerm
                    ? "Try different keywords or check spelling."
                    : "This category is empty."}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 grid-cols-2 md:gap-4 gap-2">
                {filteredProducts.map((product) => (
                  <AdCard
                    key={product._id}
                    path={`/product/${product._id}`}
                    state={product}
                    product={product}
                  />
                ))}
              </div>
            )}
          </div>
        </MarketPlaceLayout>
      </AppLayout>
    </div>
  );
};

export default ProductsPage;
