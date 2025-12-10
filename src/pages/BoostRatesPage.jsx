import React, { useState, useEffect } from "react";
import { Zap, Clock, TrendingUp, Star, ArrowRight, CheckCircle } from "lucide-react";
import AppLayout from "../layout/AppLayout";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BoostRatesPage = () => {
  const [boostRates, setBoostRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchBoostRates();
  }, []);

  const fetchBoostRates = async () => {
    try {
      setLoading(true);
      const response = await api.get("/boost/rates/active");
      if (response.data.success) {
        setBoostRates(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching boost rates:", error);
      toast.error("Failed to load boost rates");
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    if (!user) {
      toast.error("Please login to boost your ads");
      navigate("/auth/signin");
      return;
    }
    navigate("/profile/ads");
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Priority Placement",
      description: "Your ads appear at the top of search results and category listings"
    },
    {
      icon: Star,
      title: "Featured Badge",
      description: "Stand out with a special 'Featured' badge on your ads"
    },
    {
      icon: Zap,
      title: "Increased Visibility",
      description: "Get up to 5x more views and engagement on your listings"
    },
    {
      icon: CheckCircle,
      title: "Better Results",
      description: "Higher conversion rates and faster sales for your products"
    }
  ];

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-[600px] mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
        {/* Hero Section */}
        <div className="py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Boost Your Ads
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get maximum visibility for your listings with our premium boost packages. 
              Reach more customers and sell faster with priority placement.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Boost Your Ads?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Boost Package
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the perfect boost duration for your needs. All packages include priority placement and featured badges.
              </p>
            </div>

            {boostRates.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No boost packages available
                </h3>
                <p className="text-gray-600">
                  Boost packages are currently being configured. Please check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {boostRates.map((rate, index) => (
                  <div
                    key={rate._id}
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 ${
                      index === 1 ? "ring-2 ring-orange-500 scale-105" : ""
                    }`}
                  >
                    {index === 1 && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-orange-600" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {rate.displayName}
                      </h3>
                      
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-gray-900">
                          KES {rate.price.toLocaleString()}
                        </span>
                      </div>
                      
                      {rate.description && (
                        <p className="text-gray-600 mb-6">
                          {rate.description}
                        </p>
                      )}
                      
                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Priority placement
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Featured badge
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Increased visibility
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Analytics tracking
                        </div>
                      </div>
                      
                      <button
                        onClick={handleGetStarted}
                        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                          index === 1
                            ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                        }`}
                      >
                        Choose Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-orange-500 to-yellow-500">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Boost Your Sales?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of sellers who have increased their sales with our boost packages.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Start Boosting Now
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BoostRatesPage;