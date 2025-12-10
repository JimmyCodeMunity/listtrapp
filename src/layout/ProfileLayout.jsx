import React from "react";
import ProfileSidebar from "../components/ProfileSideBar";

const ProfileLayout = ({ children }) => {
  return (
    <div className="w-full text-xs font-poppins flex flex-row items-start space-x-6 mx-auto md:px-8 max-w-7xl">
      <div className="md:block hidden w-[20%]">
        <ProfileSidebar />
      </div>
      <div className="md:w-[80%] w-full sm:py-8 py-4">{children}</div>
    </div>
  );
};

export default ProfileLayout;
