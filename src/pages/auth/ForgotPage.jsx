import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../components/ui/Loader";

const ForgotPage = () => {
  const { handleSubmit } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      email: email,
    };
    const { status, data } = await handleSubmit(
      `/send-forgot-password-link`,
      body
    );
    console.log("status", status);
    setLoading(false);
    if (status === 200) {
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Reset link sent successfully.Check your email to reset your password.",
        draggable: true,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: data?.message,
        draggable: true,
      });
    }
  };
  return (
    <div className="w-full">
      <section class="flex justify-center relative">
        <div className="w-full h-full object-cover fixed bg-neutral-100">
          <div class="mx-auto max-w-lg px-6 lg:px-8 py-20">
            <div class="rounded-2xl bg-white shadow-xl">
              <form
                onSubmit={handleForgot}
                action=""
                class="lg:p-11 p-7 mx-auto"
              >
                <div class="mb-11">
                  <h1 class="text-gray-900 text-start font-manrope text-2xl font-bold leading-10 mb-2">
                    Forgot
                  </h1>
                  <p class="text-gray-500 text-start text-base font-medium leading-6">
                    Don't worry.Happens to us all.
                  </p>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
                  placeholder="Enter email"
                />
                {/* handle loading */}
                {loading ? (
                  <button
                    disabled
                    class="w-full h-12 flex flex-row items-center justify-center text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-gray-800 transition-all duration-700 bg-black shadow-sm mb-11"
                  >
                    <Loader />
                  </button>
                ) : (
                  <button class="w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-gray-800 transition-all duration-700 bg-black shadow-sm mb-11">
                    Send Reset Link
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
                <a
                  href="/auth/signup"
                  class="flex justify-center text-gray-900 text-base font-medium leading-6"
                >
                  {" "}
                  sample{" "}
                  <span class="text-orange-500 font-semibold pl-3">
                    {" "}
                    Reset Passsword
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

export default ForgotPage;
