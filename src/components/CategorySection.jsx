import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CategorySection = () => {
  const { categories } = useAuth();
  console.log("categories", categories);
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  return (
    <div className="w-full mx-auto px-4 py-4">
      <div className="w-full grid md:grid-cols-5 grid-cols-3 gap-4">
        {categories.map((cat) => {
          return (
            <Link
              to={`/marketplace?category=${cat?.categoryname}`}
              className="w-full flex flex-col justify-center items-center space-y-2 cursor-pointer"
            >
              <div className="md:h-32 md:w-32 h-16 w-16 rounded-full border border-neutral-100">
                <img
                  src={`${serverUrl}/${cat.image}`}
                  className="h-full w-full object-contain rounded-full"
                  alt=""
                />
              </div>
              <p className="md:text-sm text-xs font-poppins tracking-wider text-neutral-500">
                {cat?.categoryname}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;
