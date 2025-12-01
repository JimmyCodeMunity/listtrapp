import React, { useContext, useState } from "react";
import AuthContext, { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../components/ui/Loader";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("jameswafula2002@gmail.com");
  const [password, setPassword] = useState("anypassword");
  const [loading, setLoading] = useState(false);
  const { handleSubmit } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      email: email,
      password: password,
    };
    const { status, data } = await handleSubmit("/userlogin", body);

    if (status === 201) {
      console.log("data ret", status);
      // hoat toast
      toast.success("User logged in successfully");
      setLoading(false);
      navigate("/");
    } else {
      toast.error(data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <section class="flex justify-center relative">
        <div className="w-full h-full object-cover fixed bg-neutral-100">
          <div class="mx-auto max-w-lg px-6 lg:px-8 py-20">
            <div class="rounded-2xl bg-white shadow-xl">
              <form
                onSubmit={handleLogin}
                action=""
                class="lg:p-11 p-7 mx-auto"
              >
                <div class="mb-11">
                  <h1 class="text-gray-900 text-start font-manrope text-2xl font-bold leading-10 mb-2">
                    Welcome Back
                  </h1>
                  <p class="text-gray-500 text-start text-base font-medium leading-6">
                    Let’s get started with your 30 days free trail
                  </p>
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
                  placeholder="Enter Email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-1"
                  placeholder="Enter Password"
                />
                <a
                  href="/auth/forgot-credentials"
                  class="flex justify-end mb-6"
                >
                  <span class="text-orange-500 text-right text-base font-normal leading-6">
                    Forgot Password?
                  </span>
                </a>
                {/* add loading spinner */}
                {loading ? (
                  <button
                    disabled
                    class="w-full h-12 flex flex-row items-center justify-center text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-gray-800 transition-all duration-700 bg-black shadow-sm mb-11"
                  >
                    <Loader />
                  </button>
                ) : (
                  <button class="w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-gray-800 transition-all duration-700 bg-black shadow-sm mb-11">
                    Login
                  </button>
                )}
                <a
                  href="/auth/signup"
                  class="flex justify-center text-gray-900 text-base font-medium leading-6"
                >
                  {" "}
                  Don’t have an account?{" "}
                  <span class="text-orange-500 font-semibold pl-3">
                    {" "}
                    Sign Up
                  </span>
                </a>
                <a
                  href="/"
                  class="flex justify-center text-gray-900 text-base font-medium leading-6"
                >
                  {" "}
                  <span class="text-orange-500 font-semibold pl-3"> Back</span>
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
