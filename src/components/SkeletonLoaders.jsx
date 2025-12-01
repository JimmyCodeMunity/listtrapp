import React from "react";

const SkeletonLoaders = () => {
  return (
    <div className="w-full flex flex-row gap-4 px-6">
      <div className="w-full py-4">
        <div class="card-loader ring-1 ring-neutral-100">
          <div class="card__skeleton card__title"></div>
          <div class="card__skeleton card__description"> </div>
        </div>
      </div>
      <div className="w-full py-4">
        <div class="card-loader ring-1 ring-neutral-100">
          <div class="card__skeleton card__title"></div>
          <div class="card__skeleton card__description"> </div>
        </div>
      </div>
      <div className="w-full py-4">
        <div class="card-loader ring-1 ring-neutral-100">
          <div class="card__skeleton card__title"></div>
          <div class="card__skeleton card__description"> </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoaders;
