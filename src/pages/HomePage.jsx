import React, { useContext, useEffect, useState } from "react";
import AppLayout from "../layout/AppLayout";
import AdSection from "../components/AdSection";
import { brandzone, superman } from "../../public/images";
import CategorySection from "../components/CategorySection";
import { Dropdown } from "../components/ui/DropDown";
import FeaturedSection from "../components/FeaturedSection";
import RecommendedProducts from "../components/RecommendedProducts";
import DealsSection from "../components/DealsSection";
import CallToAction from "../components/CallToAction";
import Faq from "../components/Faq";
import Brands from "../components/Brands";
import SearchArea from "../components/SearchArea";
import FeaturedAdsSection from "../components/FeaturedAdsSection";

const HomePage = () => {
  return (
    <div>
      <AppLayout>
        <div className="md:py-8 py-3 md:px-0 px-4 mx-auto max-w-7xl">
          {/* carousel and banner */}
          <div className="w-full flex flex-row items-center space-x-4 justify-between">
            <div className="md:block hidden w-[30%] h-[300px]">
              <div className="bg-neutral-200 rounded-xl h-full overflow-hidden">
                <img
                  src={brandzone}
                  alt="image"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:px-6">
              <AdSection />
            </div>
            <div className="md:block hidden md:w-[30%] h-[300px]">
              <div className="bg-neutral-200 rounded-xl h-full overflow-hidden">
                <img
                  src={superman}
                  alt="image"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          {/* search sections */}
          {/* <SearchArea /> */}

          {/* categories */}
          <div className="w-full py-6 md:py-10">
            <CategorySection />
          </div>
          <div className="w-full py-6 sm:py-10 max-w-7xl mx-auto md:px-16 px-0">
            <DealsSection />
          </div>

          {/* products */}

          {/* recommended products */}

          <div className="w-full py-6 sm:py-10">
            <RecommendedProducts />
          </div>
          
          {/* Featured/Boosted Ads Section */}
          <FeaturedAdsSection />
          <div className="w-full py-6 sm:py-10">
            <Brands />
          </div>
          <div className="w-full py-6 sm:py-10">
            <Faq />
          </div>
          <div className="w-full py-6 sm:py-10">
            <CallToAction />
          </div>
        </div>
      </AppLayout>
    </div>
  );
};

export default HomePage;
