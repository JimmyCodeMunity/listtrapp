import React from "react";
import AppLayout from "../layout/AppLayout";
import ProfileLayout from "../layout/ProfileLayout";
import UserInformationPage from "./profile/UserInformationPage";
import { useLocation } from "react-router-dom";
import UserAdsPage from "./profile/UserAdsPage";
import PasswordSet from "./profile/PasswordSet";
import Sessions from "./profile/Sessions";
import Notifications from "./profile/Notifications";
import AddCategory from "./profile/AddCategory";
import AddSubCategory from "./profile/AddSubCategory";
import { useAuth } from "../context/AuthContext";
import Modals from "../components/ui/Modals";

const ProfilePage = () => {
  // get pathname
  const { pathname } = useLocation();
  console.log(pathname);
  const { logout } = useAuth();
  return (
    <div>
      <AppLayout>
        <div className="min-h-screen h-full w-full flex flex-row">
          <Modals />
          <ProfileLayout>
            {pathname === "/profile/userinfo" && <UserInformationPage />}
            {pathname === "/profile/ads" && <UserAdsPage />}
            {pathname === "/profile/password" && <PasswordSet />}
            {pathname === "/profile/sessions" && <Sessions />}
            {pathname === "/profile/notifications" && <Notifications />}
            {pathname === "/profile/addcategory" && <AddCategory />}
            {pathname === "/profile/addsubcategory" && <AddSubCategory />}
          </ProfileLayout>
        </div>
      </AppLayout>
    </div>
  );
};

export default ProfilePage;
