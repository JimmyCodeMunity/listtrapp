import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BottomTab from "../components/BottomTab";

const AppLayout = ({ children, hideFooter = false, hideNavbar = false }) => {
  return (
    <div className="w-full font-poppins">
      {!hideNavbar && (
        <div className="mb-40 fixed top-0 left-0 right-0 bg-white z-50">
          <Navbar />
        </div>
      )}
      <div className={hideNavbar ? "" : "md:mt-32 mt-48"}>{children}</div>
      {!hideFooter && <Footer />}
      <BottomTab />
    </div>
  );
};

export default AppLayout;
