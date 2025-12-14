import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Modals = () => {
  const { logout, user, handleSubmit, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.user?.username || "",
    email: user?.user?.email || "",
    phone: user?.user?.phone || "",
    instagramlink: user?.user?.instagramlink || "",
    whatsapplink: user?.user?.whatsapplink || "",
    tiktoklink: user?.user?.tiktoklink || "",
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      const { status, data } = await handleSubmit(
        `/auth/update-user-profile`,
        formData
      );

      if (status === 200) {
        toast.success("Profile updated successfully");
        setUser((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            ...formData,
          },
        }));
        document.getElementById("profilemodal").close(); // close modal
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Update error:", error);
      //   toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      {/* Logout Modal */}
      <dialog
        id="logoutmodal"
        className="modal py-5 rounded-xl md:min-w-[500px] min-w-[300px]"
      >
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("logoutmodal").close()}
          >
            ✕
          </button>
          <div className="w-full border border-neutral-200 p-2 border-t-0 border-l-0 border-r-0">
            <h3 className="font-bold text-lg">Confirm Logout</h3>
          </div>
          <div className="px-4 py-4">
            <p className="py-4 text-neutral-500">
              Are you sure you want to logout?
            </p>
          </div>
          <div className="flex px-4 justify-end gap-2">
            <button
              className="btn btn-sm btn-ghost bg-orange-500 text-white rounded-lg p-1"
              onClick={() => document.getElementById("logoutmodal").close()}
            >
              Cancel
            </button>
            <button
              onClick={logout}
              className="btn btn-sm btn-primary bg-red-500 text-white rounded-lg p-1"
            >
              Logout
            </button>
          </div>
        </div>
      </dialog>

      {/* Profile Update Modal */}
      <dialog
        id="profilemodal"
        className="modal py-5 rounded-xl md:min-w-[500px] min-w-[300px]"
      >
        <div className="modal-box">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById("profilemodal").close()}
          >
            ✕
          </button>
          <div className="w-full border border-neutral-200 p-2 border-t-0 border-l-0 border-r-0">
            <h3 className="font-bold text-lg">Update Profile</h3>
          </div>
          <form onSubmit={handleUpdate} className="px-4 py-4 space-y-3">
            {[
              { label: "Username", name: "username", disabled: false },
              { label: "Email", name: "email", disabled: true },
              { label: "Phone", name: "phone", disabled: false },
              {
                label: "Instagram Link",
                name: "instagramlink",
                disabled: false,
              },
              { label: "WhatsApp Link", name: "whatsapplink", disabled: false },
              { label: "TikTok Link", name: "tiktoklink", disabled: false },
            ].map((field) => (
              <div
                className="flex flex-col items-start space-y-2"
                key={field.name}
              >
                <label htmlFor={field.name} className="text-neutral-500">
                  {field.label}
                </label>
                <input
                  value={formData[field.name]}
                  onChange={handleChange}
                  type="text"
                  id={field.name}
                  name={field.name}
                  disabled={field.disabled}
                  className="w-full p-2 rounded-xl ring-1 ring-neutral-100"
                />
              </div>
            ))}

            <button
              type="submit"
              className={`w-full text-white p-2 rounded-lg ${
                loading ? "bg-orange-300 cursor-not-allowed" : "bg-orange-500"
              }`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Modals;
