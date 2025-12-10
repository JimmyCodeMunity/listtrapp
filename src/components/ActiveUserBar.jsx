import React from "react";

const ActiveUserBar = ({ activeauthor }) => {
  return (
    <div className="w-full h-40 rounded-xl rounded-lg ring-1 ring-neutral-100 shadow-md">
      <div className="w-full h-full flex flex-col space-y-5 items-center justify-center">
        <div className="rounded-full p-0.5 flex flex-row justify-center items-center bg-orange-500 h-20 w-20">
          <div className="w-full h-full p-0.5 bg-white rounded-full">
            <div className="bg-orange-500 flex flex-row items-center justify-center h-full w-full rounded-full">
              <p className="text-white text-2xl font-semibold">
                {activeauthor?.username?.slice(0, 1)}
              </p>
            </div>
          </div>
        </div>
        <p className="text-xl font-semibold">{activeauthor?.username}</p>
      </div>
    </div>
  );
};

export default ActiveUserBar;
