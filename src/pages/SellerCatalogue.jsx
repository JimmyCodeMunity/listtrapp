import React, { useEffect, useState } from "react";
import AppLayout from "../layout/AppLayout";
import { Grid3X3, Grip, ListFilterPlus, SquareMenu, Star } from "lucide-react";
import { Dropdown } from "../components/ui/DropDown";
import { selloptions } from "../constants";
import { useAuth } from "../context/AuthContext";
import { Link, useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import SkeletonLoaders from "../components/SkeletonLoaders";
import AdCard from "../components/ui/AdCard";
import { SellerReviews } from "../components/SellerReviews";

const SellerCatalogue = () => {
  const { id } = useParams(); // Get seller ID from URL
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [userads, setUserads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  // Fetch seller info and ads
  useEffect(() => {
    if (id) {
      fetchSellerData();
      getAds();
      fetchReviews();
    }
  }, [id]);

  const fetchSellerData = async () => {
    try {
      const response = await api.get(`/auth/user/${id}`);
      setSeller(response.data.user || response.data);
    } catch (error) {
      console.error("Error fetching seller:", error);
      toast.error("Failed to load seller information");
      navigate("/");
    }
  };

  const getAds = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/ad/getadsbyauthor/${id}`);
      setUserads(response.data);
    } catch (error) {
      console.error("Error fetching ads:", error);
      toast.error("Error getting seller ads");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/seller/${id}`);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  return (
    <div>
      <AppLayout>
        <div className="h-full max-w-7xl mx-auto w-full py-8 sm:px-16 px-6">
          <div className="h-40 rounded-xl w-full ring-1 ring-neutral-100 shadow-sm">
            <div className="w-full flex flex-row h-full px-6 items-center justify-between">
              <div className="w-full">
                <div className="rounded-full p-0.5 flex flex-row justify-center items-center bg-orange-500 h-20 w-20">
                  <div className="w-full h-full p-0.5 bg-white rounded-full">
                    <div className="bg-orange-500 flex flex-row items-center justify-center h-full w-full rounded-full">
                      <p className="text-white text-2xl font-semibold">
                        {seller?.username?.slice(0, 1) || "S"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col space-y-2">
                <p className="text-xl font-semibold">{seller?.username}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium">
                      {seller?.sellerRating?.average?.toFixed(1) || "0.0"}
                    </span>
                    <span className="ml-1 text-xs text-gray-500">
                      ({seller?.sellerRating?.count || 0} reviews)
                    </span>
                  </div>
                </div>
                <p className="text-md text-neutral-500 font-normal">
                  {seller?.phone || "No phone"}
                </p>
              </div>
              <div className="w-full flex flex-row items-center space-x-3">
                <button className="p-2 rounded-xl bg-black text-white">
                  Follow
                </button>
                <Link
                  to="/chats"
                  state={{ author: seller }}
                  className="text-neutral-500"
                >
                  Message
                </Link>
              </div>
            </div>
          </div>

          {/* filters */}
          <div className="py-6 w-full flex flex-row items-center justify-between">
            <div className="flex flex-row space-x-3">
              <Grip className="cursor-pointer" color="gray" size={20} />
              <SquareMenu className="cursor-pointer" color="gray" size={20} />
            </div>
            <div className="flex flex-row space-x-3">
              <p className="text-neutral-500">Sort by</p>
              <ListFilterPlus size={20} color="gray" />
              <Dropdown
                label="Select filter"
                options={selloptions}
                onSelect={(value) => console.log(value)}
              />
            </div>
          </div>
        </div>

        {/* Seller Reviews */}
        <div className="max-w-7xl sm:px-6 mx-auto">
          {seller && <SellerReviews sellerId={id} />}
        </div>

        {/* products here */}
        <div className="max-w-7xl sm:px-6 mx-auto mt-6">
          {loading ? (
            <SkeletonLoaders />
          ) : userads.length === 0 ? (
            <div className="w-full py-10 flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-neutral-600">
                No Ads Found
              </h2>
              <p className="text-neutral-400 text-sm mt-2">
                You haven’t posted any ads yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 justify-center">
              {userads?.map((ad) => (
                <AdCard
                  path={`/product/${ad._id}`}
                  state={ad}
                  key={ad._id}
                  product={ad}
                />
              ))}
            </div>
          )}

          {/* Seller Reviews */}
          {seller && (
            <div className="mt-8">
              <SellerReviews sellerId={seller._id} />
            </div>
          )}
        </div>
      </AppLayout>
    </div>
  );
};

export default SellerCatalogue;
