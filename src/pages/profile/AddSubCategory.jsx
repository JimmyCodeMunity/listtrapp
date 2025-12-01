import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../lib/api";

const AddSubCategory = ({ onSubmit }) => {
  const { categories } = useAuth();
  const [subcategoryName, setSubcategoryName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [features, setFeatures] = useState([
    { key: "", label: "", type: "String", required: true },
  ]);

  // Add a new feature field
  const addFeature = () => {
    setFeatures([
      ...features,
      { key: "", label: "", type: "String", required: true },
    ]);
  };

  // Remove a feature field
  const removeFeature = (index) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated);
  };

  // Handle feature field changes
  const handleFeatureChange = (index, field, value) => {
    const updated = [...features];
    updated[index][field] = value;
    setFeatures(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      subcategoryname: subcategoryName,
      category: categoryId,
      features,
    };

    try {
      const response = await api.post("/user/subcategory-upload", payload);
      const data = response.data;
      toast.success("subcategory added");
      // console.log("Submitted:", data);
      // clear form
      setSubcategoryName("");
      setCategoryId("");
      setFeatures([{ key: "", label: "", type: "String", required: true }]);
    } catch (error) {
      console.log("error", error);
      toast.error("erorr adding subcategory");
    }
  };

  return (
    <div className="w-full min-h-[100vh] h-full">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">Create Subcategory</h2>

        {/* Subcategory Name */}
        <div>
          <label className="block font-medium">Subcategory Name</label>
          <input
            type="text"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
            className="border w-full p-2 rounded-lg mt-1"
            required
          />
        </div>

        {/* Select Category */}
        <div>
          <label className="block font-medium">Select Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border w-full p-2 rounded-lg mt-1"
            required
          >
            <option value="">-- Choose Category --</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryname}
              </option>
            ))}
          </select>
        </div>

        {/* Dynamic Features */}
        <div>
          <label className="block font-medium">Features</label>
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center gap-2 mb-3 p-3 border rounded-lg"
            >
              <input
                type="text"
                placeholder="Key (e.g. year)"
                value={feature.key}
                onChange={(e) =>
                  handleFeatureChange(index, "key", e.target.value)
                }
                className="border p-2 rounded-lg flex-1"
                required
              />
              <input
                type="text"
                placeholder="Label (e.g. Year of Manufacture)"
                value={feature.label}
                onChange={(e) =>
                  handleFeatureChange(index, "label", e.target.value)
                }
                className="border p-2 rounded-lg flex-1"
                required
              />
              <select
                value={feature.type}
                onChange={(e) =>
                  handleFeatureChange(index, "type", e.target.value)
                }
                className="border p-2 rounded-lg"
              >
                <option value="String">String</option>
                <option value="Number">Number</option>
                <option value="Boolean">Boolean</option>
              </select>
              <label className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={feature.required}
                  onChange={(e) =>
                    handleFeatureChange(index, "required", e.target.checked)
                  }
                />
                <span>Required</span>
              </label>

              {features.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500"
                >
                  ✖
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addFeature}
            className="bg-black text-white px-3 py-1 rounded-lg mt-2"
          >
            + Add Feature
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-700"
        >
          Create Subcategory
        </button>
      </form>
    </div>
  );
};

export default AddSubCategory;
