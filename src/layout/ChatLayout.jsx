import React from "react";
import ProfileSidebar from "../components/ProfileSideBar";
import ActiveUserBar from "../components/ActiveUserBar";

const ChatLayout = ({ children, activeauthor }) => {
  return (
    <div className="w-full font-poppins flex flex-row items-start space-x-6 mx-auto md:px-8 max-w-7xl">
      <div className="md:block hidden w-[20%]">
        <ProfileSidebar />
      </div>
      <div className=" w-full sm:py-8 py-4">{children}</div>
      {/* <div className="md:block hidden w-[30%]">
        <ActiveUserBar activeauthor={activeauthor} />
      </div> */}
    </div>
  );
};

export default ChatLayout;
