import React, { useState, useEffect } from "react";
import { TrendingUp, Zap, ArrowRight } from "lucide-react";
import api from "../lib/api";
import AdCard from "./ui/AdCard";
import { useNavigate } from "react-router-dom";

const FeaturedAdsSection = () => {
  const [featuredAds, setFeaturedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedAds();
  }, []);

  const fetchFeaturedAds = async () => {
    try {
      setLoading(true);
      const response = await api.get("/ad/getads?featured=true&limit=6");
      if (response.data.success) {
        setFeaturedAds(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching featured ads:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredAds.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Ads</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover premium listings from our community. These ads get priority placement and increased visibility.
          </p>
        </div>

        {/* Featured Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featuredAds.map((ad) => (
            <div key={ad._id} className="transform hover:scale-105 transition-transform duration-300">
              <AdCard product={ad} />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={() => navigate("/ads?featured=true")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-full font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl mr-4"
          >
            <Zap className="w-5 h-5" />
            View All Featured Ads
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/boost-rates")}
            className="inline-flex items-center gap-2 bg-white text-orange-600 border-2 border-orange-500 px-6 py-3 rounded-full font-medium hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <TrendingUp className="w-5 h-5" />
            Boost Your Ads
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAdsSection;