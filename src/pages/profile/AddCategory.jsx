import { Trash } from "lucide-react";
import React, { useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

const AddCategory = () => {
  const [categoryname, setCategoryname] = useState("Test");
  const [image, setImage] = useState(null);

  const formData = new FormData();
  formData.append("categoryname", categoryname);
  formData.append("image", image); // must be a File object
  const handleUpload = async (e) => {
    e.preventDefault();
    toast.success("clicked");
    console.log(categoryname, image);
    try {
      const response = await api.post("/user/ad-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // console.log("loading");
      toast.success("product uploaded");
      console.log("response", response.data);
    } catch (error) {
      toast.error("error while uploading");
      console.log("error", error);
      // console.log("loading off");
    }
  };
  return (
    <div className="w-full h-full">
      <div className="w-full p-6">
        <h2 className="text-2xl tracking-wider text-neutral-500">User Ads</h2>
      </div>
      <div className="w-full h-full rounded-xl shadow-md bg-white ring-1 ring-neutral-100">
        <form action="" onSubmit={handleUpload} encType="multipart/form-data">
          <div class="relative mb-6">
            <label class="flex  items-center mb-2 text-gray-600 text-sm font-medium">
              Categoryname{" "}
              <svg
                width="7"
                height="7"
                class="ml-1"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                  fill="#EF4444"
                />
              </svg>
            </label>
            <input
              value={categoryname}
              onChange={(e) => setCategoryname(e.target.value)}
              type="text"
              id="default-search"
              class="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none "
              placeholder=""
              required=""
            />
          </div>
          <div class="relative mb-6">
            <label class="flex  items-center mb-2 text-gray-600 text-sm font-medium">
              Image{" "}
              <svg
                width="7"
                height="7"
                class="ml-1"
                viewBox="0 0 7 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                  fill="#EF4444"
                />
              </svg>
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              name="image"
              type="file"
              id="default-search"
              class="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none "
              placeholder=""
              required=""
            />
            <div class="flex items-center  my-4">
              <input
                id="checkbox-default"
                type="checkbox"
                value=""
                class="w-5 h-5 appearance-none border border-gray-300  rounded-md mr-2 hover:border-indigo-500 hover:bg-indigo-100 checked:bg-no-repeat checked:bg-center checked:border-indigo-500 checked:bg-indigo-100"
              />
              <label
                for="checkbox-default"
                class="text-sm font-normal text-gray-600"
              >
                Remember me
              </label>
            </div>
          </div>
          <button class="w-52 h-12 bg-orange-500 hover:bg-indigo-800 transition-all duration-700 rounded-full shadow-xs text-white text-base font-semibold leading-6 mb-6">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
