import axios from "axios";
import { div } from "framer-motion/client";
import { Image, Loader2, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const PasswordSet = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [features, setFeatures] = useState([]);
  const [featureValues, setFeatureValues] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const author = user?.user?._id;
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // const handleImageChange = (e) => {
  //   setImages([...e.target.files]); // store all selected files
  // };
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/cat/getcategories`)
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

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/cat/getsubcategories/${id}`
    );
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ad/createad`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response.data);
      toast.success("Ad submitted successfully!");
      setLoading(false);
    } catch (err) {
      console.error("error", err);
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-full p-6">
        <h2 className="text-2xl tracking-wider text-neutral-500">
          Password Reset
        </h2>
      </div>
      <div className="w-full h-full rounded-xl shadow-md bg-white ring-1 ring-neutral-100">
        <form onSubmit={handleSubmit} className="p-5 flex flex-col space-y-4">
          <label>Category</label>
          <select
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            <>
              <label>Subcategory</label>
              <select
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
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
            </>
          )}

          {features.length > 0 && (
            <div className="w-full md:grid grid-cols-2  flex flex-row items-center flex-wrap gap-4">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className="w-full flex flex-col items-start"
                >
                  <label>{feature.label}</label>
                  <input
                    className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
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
                <div className="w-full flex flex-col">
                  <label>Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    type="text"
                    placeholder="enter title"
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    type="text"
                    placeholder="enter description"
                  />
                </div>
                <div>
                  <label>Price</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
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
                    <h2 class="text-center text-gray-400   text-xs leading-4">
                      PNG, JPG or WEBP, smaller than 4MB
                    </h2>
                  </div>
                )}
                <div class="grid gap-2">
                  {preview?.length < 1 && (
                    <h4 class="text-center text-gray-900 text-sm font-medium leading-snug">
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
  );
};

export default PasswordSet;
