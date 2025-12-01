import { Plus, Trash, Image, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import SkeletonLoaders from "../../components/SkeletonLoaders";
import ProductCard from "../../components/ui/ProductCard";
import AdCard from "../../components/ui/AdCard";
import { useLocation } from "react-router-dom";

const UserAdsPage = () => {
  const { user } = useAuth();
  const author = user?.user?._id;
  const [myads, setMyAds] = useState([]);
  const [loading, setLoading] = useState(false);
  // server url
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    getUserAds();
  }, [author]);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("post") === "true") {
      document.getElementById("my_modal_3").showModal();

      // Optional: Clean URL after opening (removes ?post=true)
      window.history.replaceState({}, "", "/profile/ads");
    }
  }, [location]);

  // get my ads
  const getUserAds = async () => {
    try {
      const response = await api.get(`/ad/getadsbyauthor/${author}`);
      const data = response.data;
      setMyAds(data);
      setLoading(false);
      console.log("my ads", data);
    } catch (error) {
      console.log("error", error);
      toast.error("error getting ads");
      return;
    }
  };

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [features, setFeatures] = useState([]);
  const [featureValues, setFeatureValues] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    api
      .get("/cat/getcategories")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  // console.log("categories", categories);
  // console.log("subcategories", subcategories);
  // console.log("features", features);

  const handleCategoryChange = async (e) => {
    const id = e.target.value;
    setSelectedCategory(id);
    setSelectedSubcategory(null);
    setFeatures([]);
    setFeatureValues({});

    const res = await api.get(`/cat/getsubcategories/${id}`);
    setSubcategories(res.data);
    // DON'T set features here because res.data is array of subcategories
  };

  const handleSubcategoryChange = (e) => {
    const id = e.target.value;
    setSelectedSubcategory(id);
    setFeatureValues({});

    // Find selected subcategory from state
    const selectedSub = subcategories.find((sub) => sub._id === id);

    if (selectedSub && selectedSub.features) {
      setFeatures(selectedSub.features);
    } else {
      setFeatures([]);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Preview images
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  // const handleSubmit = async (e) => {
  //   setLoading(true);
  //   e.preventDefault();
  //   const formData = new FormData();
  //   // ✅ Append all images
  // images.forEach((img) => {
  //   formData.append("image", img);
  // });

  //   const payload = {
  //     category: selectedCategory,
  //     subcategory: selectedSubcategory,
  //     featureValues,
  //     title,
  //     description,
  //     price,
  //     author,
  //   };
  //   // check missing values
  //   if (
  //     !selectedCategory ||
  //     !selectedSubcategory ||
  //     !title ||
  //     !description ||
  //     !price
  //   ) {
  //     toast.error("Please fill all the fields");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     await axios.post("http://localhost:5000/api/v1/ad/createad", payload);
  //     toast.success("Ad submitted successfully!");
  //     setLoading(false);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Something went wrong");
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !selectedCategory ||
      !selectedSubcategory ||
      !title ||
      !description ||
      !price
    ) {
      toast.error("Please fill all the fields");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    images.forEach((img) => formData.append("image", img));

    // ✅ Append images
    // images.forEach((img) => {
    //   formData.append("image", img);
    // });

    // ✅ Append other fields
    formData.append("category", selectedCategory);
    formData.append("subcategory", selectedSubcategory);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("author", author);

    // ✅ Append featureValues (convert object → JSON string)
    formData.append("featureValues", JSON.stringify(featureValues));

    try {
      // console.log("FormData contents:");
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      // return;
      const response = await api.post("/ad/createad", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response", response.data);
      toast.success("Ad submitted successfully!");
      getUserAds();
      setLoading(false);
      // CLEAR
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
      setPreview([]);
    } catch (err) {
      console.error("error", err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full p-6 flex-row flex justify-between items-center">
        <div>
          <h2 className="text-lg tracking-wider text-neutral-500">User Ads</h2>
        </div>
        <div>
          {/* You can open the modal using document.getElementById('ID').showModal() method */}
          <button
            className="btn bg-orange-500 rounded-md p-2 text-white text-xs flex flex-row items-center gap-1"
            onClick={() => document.getElementById("my_modal_3").showModal()}
          >
            <Plus color="white" size={20} />
            Post New Add
          </button>
          <dialog
            id="my_modal_3"
            className="modal p-3 rounded-xl min-h-60 w-[60%]"
          >
            <div className="modal-box">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-normal text-md my-2 text-neutral-500">
                Post new Ad
              </h3>
              {/* form here */}
              <div className="w-full h-full rounded-xl shadow-md bg-white ring-1 ring-neutral-100">
                <form
                  onSubmit={handleSubmit}
                  className="p-5 flex flex-col space-y-4 text-xs"
                >
                  <label>Category</label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onChange={handleCategoryChange}
                    value={selectedCategory || ""}
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryname}
                      </option>
                    ))}
                  </select>

                  {selectedCategory && (
                    <div className="space-y-2">
                      <label>Subcategory</label>
                      <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        onChange={handleSubcategoryChange}
                        value={selectedSubcategory || ""}
                      >
                        <option value="" disabled>
                          Select subcategory
                        </option>
                        {subcategories.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.subcategoryname}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {features.length > 0 && (
                    <div className="w-full md:grid grid-cols-2  flex flex-row items-center flex-wrap gap-4">
                      {features.map((feature) => (
                        <div
                          key={feature.key}
                          className="w-full flex flex-col items-start space-y-2"
                        >
                          <label>{feature.label}</label>
                          <input
                            className="w-full border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            type={feature.type === "Number" ? "number" : "text"}
                            value={featureValues[feature.key] || ""}
                            onChange={(e) =>
                              setFeatureValues({
                                ...featureValues,
                                [feature.key]: e.target.value,
                              })
                            }
                            required={feature.required}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedSubcategory && (
                    <div>
                      <div className="w-full md:grid grid-cols-2 gap-4">
                        <div className="w-full flex flex-col space-y-2">
                          <label>Title</label>
                          <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            type="text"
                            placeholder="enter title"
                          />
                        </div>
                        <div className="space-y-2">
                          <label>Description</label>
                          <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            type="text"
                            placeholder="enter description"
                          />
                        </div>
                        <div className="space-y-2">
                          <label>Price</label>
                          <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                            type="text"
                            placeholder="enter price"
                          />
                        </div>
                      </div>
                      <div class="w-full my-4 py-9 bg-gray-50 rounded-2xl border border-gray-300 gap-3 grid border-dashed">
                        {preview?.length < 1 && (
                          <div class="grid gap-1">
                            <div className="text-center w-full flex flex-row items-center justify-center">
                              <Image size={40} color="gray" />
                            </div>
                            <h2 class="text-center text-gray-400 text-xs leading-4">
                              PNG, JPG or WEBP, smaller than 4MB
                            </h2>
                          </div>
                        )}
                        <div class="grid gap-2">
                          {preview?.length < 1 && (
                            <h4 class="text-center text-gray-900 text-xs font-medium leading-snug">
                              Drag and Drop your file here or
                            </h4>
                          )}
                          <div className="w-full flex flex-row gap-2 mx-auto max-w-[60%] flex-wrap items-start justify-start">
                            {preview.map((src, i) => (
                              <img
                                className="h-32 w-32 object-fit rounded-xl"
                                key={i}
                                src={src}
                                alt="preview"
                                width={100}
                              />
                            ))}
                          </div>
                          <div class="flex items-center justify-center">
                            <label>
                              <input
                                onChange={handleImageChange}
                                type="file"
                                hidden
                                accept="image/*"
                                name="image"
                                multiple
                              />
                              <div class="flex w-28 h-9 px-2 flex-col bg-orange-500 rounded-full shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none">
                                Choose File
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* handle loading */}

                  {loading ? (
                    <button
                      className="w-full bg-orange-500 text-white px-4 py-2 rounded-full flex flex-row items-center justify-center"
                      type="submit"
                    >
                      {/* spinner */}
                      <Loader2 className="mr-2 h-10 w-10 animate-spin" />
                      Submitting...
                    </button>
                  ) : (
                    <button
                      className="w-full bg-orange-500 text-white px-4 py-2 rounded-full"
                      type="submit"
                    >
                      Submit Ad
                    </button>
                  )}
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <div
        className={`w-full h-full rounded-xl bg-white ${
          myads.length > 1 ? "ring-1 ring-neutral-100 shadow-md" : ""
        }`}
      >
        {loading ? (
          <SkeletonLoaders />
        ) : myads.length === 0 ? (
          <div className="w-full py-10 flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold text-neutral-600">
              No Ads Found
            </h2>
            <p className="text-neutral-400 text-sm mt-2">
              You haven’t posted any ads yet.
            </p>
          </div>
        ) : (
          <div className="grid p-4 md:grid-cols-3 grid-cols-2 lg:grid-cols-3 md:gap-4 gap-2 justify-center">
            {myads.slice(0, 9).map((ad) => (
              <AdCard
                path={`/product/${ad._id}`}
                state={ad}
                key={ad._id}
                product={ad}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAdsPage;
