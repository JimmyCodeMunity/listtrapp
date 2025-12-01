import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const MainCarousel = ({ children }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <Carousel
        autoPlay
        infiniteLoop
        interval={5000}
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        stopOnHover={true}
        className="rounded-lg overflow-hidden"
      >
        {React.Children.map(children, (child) => (
          <div className="w-full md:h-[400px] h-[200px]">{child}</div>
        ))}
      </Carousel>
    </div>
  );
};

export default MainCarousel;
