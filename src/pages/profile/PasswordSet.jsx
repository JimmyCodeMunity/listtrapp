import axios from "axios";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";

const PasswordSet = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/user/auth/update-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Password updated successfully!");
      
      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch (err) {
      console.error("Password update error:", err);
      toast.error(
        err.response?.data?.message || "Failed to update password"
      );
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full p-6">
        <h2 className="text-2xl tracking-wider text-neutral-700 font-semibold">
          Change Password
        </h2>
        <p className="text-sm text-neutral-500 mt-2">
          Update your password to keep your account secure
        </p>
      </div>
      <div className="w-full rounded-xl shadow-md bg-white ring-1 ring-neutral-100">
        <form onSubmit={handleSubmit} className="p-6 flex flex-col space-y-6">
          {/* Current Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Current Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Password must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-neutral-700">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {loading ? (
              <button
                disabled
                className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg flex flex-row items-center justify-center font-medium"
                type="button"
              >
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Updating Password...
              </button>
            ) : (
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                type="submit"
              >
                Update Password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordSet;
