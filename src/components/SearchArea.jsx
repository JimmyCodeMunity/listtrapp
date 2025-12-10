import { Search, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CategoryDropDown } from "./ui/CategoryDropDown";
import { useAuth } from "../context/AuthContext";
import ProductCard from "./ui/ProductCard";
import toast from "react-hot-toast";

const SearchArea = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { categories, ads } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredAds, setFilteredAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get initial search query from URL
  useEffect(() => {
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    if (query) {
      setSearchQuery(query);
    }
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filter ads based on search query and category
  useEffect(() => {
    setIsLoading(true);
    try {
      let results = ads;

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        results = results.filter((ad) => {
          const title = ad.title?.toLowerCase() || "";
          const description = ad.description?.toLowerCase() || "";
          const category = ad.category?.name?.toLowerCase() || "";
          const subcategory = ad.subcategory?.name?.toLowerCase() || "";
          
          return (
            title.includes(query) ||
            description.includes(query) ||
            category.includes(query) ||
            subcategory.includes(query)
          );
        });
      }

      // Filter by category
      if (selectedCategory) {
        results = results.filter((ad) => {
          const categoryId = ad.category?._id || ad.category;
          return categoryId === selectedCategory;
        });
      }

      setFilteredAds(results);
    } catch (error) {
      console.error("Error filtering ads:", error);
      toast.error("Error filtering results");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, ads]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() || selectedCategory) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      navigate(`/search?${params.toString()}`);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (categoryId) params.set("category", categoryId);
    navigate(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    navigate("/search");
  };

  return (
    <div className="w-full">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-8 px-4 md:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-2xl font-bold mb-4 text-center">
            Find Your Perfect Product
          </h1>
          <form onSubmit={handleSearch} className="w-full">
            <div className="w-full h-14 border border-gray-200 bg-white rounded-full flex flex-row items-center justify-between shadow-md">
              <div className="flex flex-row items-center">
                <div className="border-r border-gray-300 h-10 px-4 flex flex-row items-center">
                  <CategoryDropDown
                    label="Categories"
                    options={categories}
                    onSelect={handleCategorySelect}
                  />
                </div>
              </div>
              <div className="flex-1 px-4">
                <input
                  type="text"
                  placeholder="Search for products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 w-full bg-transparent border-0 focus:outline-none text-sm"
                />
              </div>
              <div className="pr-2">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 h-10 px-6 rounded-full text-white font-medium transition-colors flex items-center gap-2"
                >
                  <Search size={18} />
                  <span className="hidden md:inline">Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Active Filters */}
        {(searchQuery || selectedCategory) && (
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-gray-700">
              Active filters:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                Search: "{searchQuery}"
                <button
                  onClick={() => {
                    setSearchQuery("");
                    const params = new URLSearchParams();
                    if (selectedCategory) params.set("category", selectedCategory);
                    navigate(`/search?${params.toString()}`);
                  }}
                  className="hover:bg-orange-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                Category: {categories.find((c) => c._id === selectedCategory)?.name}
                <button
                  onClick={() => {
                    setSelectedCategory("");
                    const params = new URLSearchParams();
                    if (searchQuery.trim()) params.set("q", searchQuery.trim());
                    navigate(`/search?${params.toString()}`);
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isLoading ? (
              "Searching..."
            ) : (
              <>
                {filteredAds.length} {filteredAds.length === 1 ? "result" : "results"} found
              </>
            )}
          </h2>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No results found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <button
              onClick={clearFilters}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredAds.map((ad) => (
              <ProductCard key={ad._id} product={ad} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchArea;
