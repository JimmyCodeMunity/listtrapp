import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/ui/Loader";

const ResetPasswordPage = () => {
  const { handleSubmit } = useContext(AuthContext);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { token } = useParams();

  const handlePassReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    // confirm password match
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Passwords do not match",
        draggable: true,
      });
      setLoading(false);
      return;
    } else {
      const body = {
        password: password,
      };
      const { status, data } = await handleSubmit(
        `/reset-password/${token}`,
        body
      );
      console.log("status", status);
      setLoading(false);
      if (status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Password reset successfully",
          draggable: true,
        });
        navigate("/auth/signin");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error...",
          text: data?.message,
          draggable: true,
        });
      }
    }
  };
  return (
    <div className="w-full">
      <section class="flex justify-center relative">
        <div className="w-full h-full object-cover fixed bg-neutral-100">
          <div class="mx-auto max-w-lg px-6 lg:px-8 py-20">
            <div class="rounded-2xl bg-white shadow-xl">
              <form
                action=""
                class="lg:p-11 p-7 mx-auto"
                onSubmit={handlePassReset}
              >
                <div class="mb-11">
                  <h1 class="text-gray-900 text-start font-manrope text-2xl font-bold leading-10 mb-2">
                    Password reset
                  </h1>
                  <p class="text-gray-500 text-start text-base font-medium leading-6">
                    Enter new password and reset
                  </p>
                </div>
                <input
                  type="password"
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

                {/* loading */}
                {loading ? (
                  <button
                    disabled
                    class="w-full h-12 flex flex-row items-center justify-center text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-gray-800 transition-all duration-700 bg-black shadow-sm mb-11"
                  >
                    <Loader />
                  </button>
                ) : (
                  <button class="w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-indigo-800 transition-all duration-700 bg-black shadow-sm mb-11">
                    Submit
                  </button>
                )}

                <a
                  href="/auth/signin"
                  class="flex justify-center text-gray-900 text-base font-medium leading-6"
                >
                  {" "}
                  I remember my password{" "}
                  <span class="text-orange-500 font-semibold pl-3">
                    {" "}
                    Sign In
                  </span>
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPasswordPage;
