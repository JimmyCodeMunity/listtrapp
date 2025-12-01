import { Search } from "lucide-react";
import React from "react";
import { CategoryDropDown } from "./ui/CategoryDropDown";
import { categories } from "../constants";

const SearchArea = () => {
  return (
    <div className="h-60 w-full bg-orange-500 flex flex-col justify-center items-center px-8">
      <div className="w-full h-12 border border-neutral-200 bg-white rounded-full flex flex-row items-center justify-between">
        <div className="flex flex-row items-center">
          <div className="border border-l-0 border-t-0 border-b-0 border-neutral-300 h-full px-4 flex flex-row items-center space-x-2">
            <CategoryDropDown
              label="Categories"
              options={categories}
              // onSelect={handleCategorySelect}
            />
          </div>
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Asus"
            className="h-6 w-full px-4 bg-transparent border-0 focus:outline-none"
          />
        </div>
        <div>
          <button className="h-8 w- rounded-full text-black">
            <Search size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchArea;
