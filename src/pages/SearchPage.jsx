import React from "react";
import AppLayout from "../layout/AppLayout";
import SearchArea from "../components/SearchArea";

const SearchPage = () => {
  return (
    <AppLayout>
      <div className="w-full py-6">
        <SearchArea />
      </div>
    </AppLayout>
  );
};

export default SearchPage;
