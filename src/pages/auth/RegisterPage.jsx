import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../components/ui/Loader";

const RegisterPage = () => {
  const { handleSubmit } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      username: username,
      phone: phoneNumber,
      email: email,
      password: password,
    };

    const { status, data } = await handleSubmit("/createuser", body);

    if (status === 201) {
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "User registered successfully.Please check to email and verify account.",
        draggable: true,
      });
      setUsername("");
      setPhoneNumber("");
      setEmail("");
      setPassword("");
      setLoading(false);
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
                onSubmit={handleRegister}
                action=""
                class="lg:p-11 p-7 mx-auto"
              >
                <div class="mb-11">
                  <h1 class="text-gray-900 text-start font-manrope text-2xl font-bold leading-10 mb-2">
                    Create Account
                  </h1>
                  <p class="text-gray-500 text-start text-base font-medium leading-6">
                    Let’s get started with your 30 days free trail
                  </p>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-6"
                  placeholder="Username"
                />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-1"
                  placeholder="Phone number"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-1"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="w-full h-12 text-gray-900 placeholder:text-gray-400 text-lg font-normal leading-7 rounded-full border-gray-300 border shadow-sm focus:outline-none px-4 mb-1"
                  placeholder="Password"
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
                    class="w-full h-12 flex flex-row items-center justify-center text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-indigo-800 transition-all duration-700 bg-black shadow-sm mb-11"
                  >
                    <Loader />
                  </button>
                ) : (
                  <button class="w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-indigo-800 transition-all duration-700 bg-black shadow-sm mb-11">
                    Register
                  </button>
                )}
                <a
                  href="/auth/signin"
                  class="flex justify-center text-gray-900 text-base font-medium leading-6"
                >
                  {" "}
                  Don’t have an account?{" "}
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

export default RegisterPage;
