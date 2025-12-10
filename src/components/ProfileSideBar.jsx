import { BellDot, Computer, LockKeyhole, MessageCircle, Rss, UserCircle, Zap, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ProfileSidebar = () => {
  const { pathname } = useLocation();
  // set active
  const [active, setActive] = useState(pathname);

  const profilesidebarlinks = [
    {
      name: "User Information",
      icon: UserCircle,
      path: "/profile/userinfo",
    },
    {
      name: "My Ads",
      icon: ShoppingBag,
      path: "/profile/ads",
    },
    {
      name: "Notifications",
      icon: BellDot,
      path: "/profile/notifications",
    },
    {
      name: "Support Chat",
      icon: MessageCircle,
      path: "/profile/support",
    },
  ];
  const securesidebarlinks = [
    {
      name: "Password",
      icon: LockKeyhole,
      path: "/profile/password",
    },
  ];
  return (
    <div className="w-full rounded-xl h-screen mt-8 bg-white border border-neutral-100 p-5">
      <div className="py-5 space-y-5">
        <p className="text-neutral-500 text-md">Profile</p>

        <div className="w-full space-y-5">
          {profilesidebarlinks.map((link) => {
            return (
              <div
                className={`flex flex-row space-x-3 items-center ${
                  active === link.path
                    ? "bg-orange-500 text-white sm:py-2 rounded-xl sm:px-2"
                    : "sm:py-2 sm:px-2"
                }`}
              >
                <link.icon
                  color={active === link.path ? "white" : "gray"}
                  size={18}
                />
                <Link to={link.path}>
                  <p
                    className={`text-neutral-700 text-xs ${
                      active === link.path ? "text-white" : ""
                    }`}
                  >
                    {link.name}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-5 space-y-5">
        <p className="text-neutral-500 text-md">Secure</p>

        <div className="w-full space-y-5">
          {securesidebarlinks.map((link) => {
            return (
              <div
                className={`flex flex-row space-x-3 items-center ${
                  active === link.path
                    ? "bg-orange-500 text-white sm:py-2 rounded-xl sm:px-2"
                    : "sm:py-2 sm:px-2"
                }`}
              >
                <link.icon
                  color={active === link.path ? "white" : "gray"}
                  size={18}
                />
                <Link to={link.path}>
                  <p
                    className={`text-neutral-700 text-xs ${
                      active === link.path ? "text-white" : ""
                    }`}
                  >
                    {link.name}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
