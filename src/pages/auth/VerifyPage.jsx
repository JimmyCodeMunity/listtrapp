import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";
import Loader from "../../components/ui/Loader";

const VerifyPage = () => {
  const { token } = useParams(); //get from link

  const { handleSubmit } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Verify", token);

    const { status, data } = await handleSubmit(`/verify-email/${token}`, {});
    console.log("status", status);

    if (status === 201) {
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Email verified successfully",
        draggable: true,
      });
    } else if (status === 400) {
      // call axios error

      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Email already verified",
        draggable: true,
      });
    } else {
      console.log("data", data);
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: "Something went wrong",
        draggable: true,
      });
    }
    setLoading(false);
  };
  return (
    <div className="w-full">
      <section class="flex justify-center relative">
        <div className="w-full h-full object-cover fixed bg-neutral-100">
          <div class="mx-auto max-w-lg px-6 lg:px-8 py-20">
            <div class="rounded-2xl bg-white shadow-xl">
              <form
                onSubmit={handleVerify}
                action=""
                class="lg:p-11 p-7 mx-auto"
              >
                <div class="mb-11">
                  <h1 class="text-gray-900 text-start font-manrope text-2xl font-bold leading-10 mb-2">
                    Verify Email
                  </h1>
                  <p class="text-gray-500 text-start text-base font-medium leading-6">
                    Click button to verify account.
                  </p>
                </div>
                {/* HANDLE LOADER */}
                {loading ? (
                  <button
                    disabled
                    class="w-full h-12 flex flex-row items-center justify-center text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-gray-800 transition-all duration-700 bg-black shadow-sm mb-11"
                  >
                    <Loader />
                  </button>
                ) : (
                  <button class="w-full h-12 text-white text-center text-base font-semibold leading-6 rounded-full hover:bg-gray-800 transition-all duration-700 bg-black shadow-sm mb-11">
                    Verify
                  </button>
                )}
                <a
                  href="/auth/signin"
                  class="flex justify-center text-gray-900 text-base font-medium leading-6"
                >
                  {" "}
                  Verified?{" "}
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

export default VerifyPage;
