import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { newban1, newban2, newban3 } from "../../public/images";

const AdCarousel = () => {
  return (
    <div className="w-full max-w-7xl mx-auto md:px-8 py-4">
      <Carousel
        autoPlay
        infiniteLoop
        interval={4000}
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        stopOnHover={true}
        className="rounded-lg overflow-hidden shadow-xl"
      >
        {[newban1, newban2, newban3].map((banner, index) => (
          <div key={index} className="relative w-full h-[300px] md:h-[320px]">
            <img
              src={banner}
              alt={`Therapy banner ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Optional: Add overlay text */}
            {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <h2 className="text-white text-2xl font-semibold">Your Message</h2>
            </div> */}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default AdCarousel;
