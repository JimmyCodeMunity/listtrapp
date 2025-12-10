import {
  Edit,
  Instagram,
  Link,
  MessageCircle,
  MessageCircleCodeIcon,
} from "lucide-react";
import React from "react";
import { useAuth } from "../../context/AuthContext";

const UserInformationPage = () => {
  const { user } = useAuth();
  return (
    <div className="w-full h-full">
      <div className="w-full px-0 py-6">
        <h2 className="text-lg tracking-wider text-neutral-500">Profile</h2>
      </div>
      <div className="w-full h-full rounded-xl shadow-md bg-white ring-1 ring-neutral-100">
        <div className="w-full flex flex-row items-start space-x-5 border border-t-0 border-l-0 border-r-0 border-neutral-200 p-6">
          <div>
            <img
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D"
              className="h-32 w-32 rounded-full border-1 border-orange-200"
              alt=""
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button className="border border-neutral-300 text-xs text-neutral-700 px-4 py-2 rounded-full">
              Upload New Photo
            </button>
            {/* <button
              onClick={() => document.getElementById("my_modal_1").showModal()}
              className="border border-neutral-300 bg-orange-500 text-white px-4 py-2 rounded-full"
            >
              Logout
            </button> */}
            {/* Open the modal using document.getElementById('ID').showModal() method */}

            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="btn border bg-orange-500 text-white text-xs border-neutral-300 text-neutral-700 px-4 py-2 rounded-full"
              onClick={() => document.getElementById("logoutmodal").showModal()}
            >
              Logout
            </button>

            <p className="text-neutral-500 text-xs">
              At least 500 x 500 recommended.
            </p>
            <p className="text-neutral-500 text-xs">JPG or PNG is allowed.</p>
          </div>
        </div>

        <div className="w-full border space-y-5 border-t-0 border-l-0 border-r-0 border-neutral-200 p-6">
          <div className="w-full flex flex-row items-center justify-between">
            <div>
              <p className="text-neutral-500 text-lg">Personal Info</p>
            </div>
            <div>
              <button
                onClick={() =>
                  document.getElementById("profilemodal").showModal()
                }
                className="flex flex-row items-center space-x-4 p-2 border border-neutral-200 rounded-xl"
              >
                <Edit size={15} color="gray" />
                <span className="ml-1 text-xs">Edit</span>
              </button>
            </div>
          </div>

          {/* info */}
          <div className="w-full space-y-6">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-start">
                <p className="text-neutral-500 text-sm">Full Name</p>
                <p className="text-neutral-700 text-xs">
                  {user?.user?.username}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-neutral-500 text-sm">Email</p>
                <p className="text-neutral-700 text-xs">{user?.user?.email}</p>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-neutral-500 text-sm">Phone</p>
                <p className="text-neutral-700 text-xs">
                  {user?.user?.phone || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-start text-center">
                <p className="text-neutral-500 text-sm">Instagram</p>
                <a
                  href={user?.user?.instagramlink}
                  target="_blank"
                  className="text-neutral-700"
                >
                  <Instagram color="gray" size={20} />
                </a>
              </div>
              <div className="flex flex-col items-start text-center ">
                <p className="text-neutral-500 text-sm">WhatsApp</p>
                <a
                  href={user?.user?.whatsapplink}
                  target="_blank"
                  className="text-neutral-700"
                >
                  <MessageCircleCodeIcon color="gray" size={20} />
                </a>
              </div>
              <div className="flex flex-col items-start">
                <p className="text-neutral-500 text-sm">TikTok</p>
                <a
                  href={user?.user?.tiktoklink}
                  target="_blank"
                  className="text-neutral-700"
                >
                  <MessageCircle color="gray" size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformationPage;
