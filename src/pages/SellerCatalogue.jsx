import React, { useEffect, useState } from "react";
import AppLayout from "../layout/AppLayout";
import { Grid3X3, Grip, ListFilterPlus, SquareMenu } from "lucide-react";
import { Dropdown } from "../components/ui/DropDown";
import { selloptions } from "../constants";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import SkeletonLoaders from "../components/SkeletonLoaders";
import AdCard from "../components/ui/AdCard";

const SellerCatalogue = () => {
  const location = useLocation();
  const author = location.state || {};
  console.log("user here", author);
  const [userads, setUserads] = useState([]);
  const [loading, setLoading] = useState(false);

  //   get ads based on current user
  useEffect(() => {
    getAds();
  }, [author._id]);

  const getAds = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/ad/getadsbyauthor/${author._id}`);
      const data = response.data;
      setUserads(data);
      console.log("ad", data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      toast.error("error getting this users ads");
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
                        {author?.username?.slice(0, 1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col space-y-2">
                <p className="text-xl font-semibold">{author?.username}</p>
                <p className="text-md text-neutral-500 font-normal">
                  {author?.phone || "null"}
                </p>
              </div>
              <div className="w-full flex flex-row items-center space-x-3">
                <button className="p-2 rounded-xl bg-black text-white">
                  Follow
                </button>
                <Link
                  to={`/chat/${author._id}`}
                  state={author}
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

        {/* products here */}

        <div className="max-w-7xl sm:px-6 mx-auto">
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
        </div>
      </AppLayout>
    </div>
  );
};

export default SellerCatalogue;
