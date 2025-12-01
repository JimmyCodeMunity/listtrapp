import { Group, HomeIcon, Layers, Layers2 } from "lucide-react";
import React from "react";

const BreadCrump = ({ home, category, productname, subcategory }) => {
  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto px-8 py-4">
        <nav
          className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50"
          aria-label="Breadcrumb"
        >
          <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
            <li className="inline-flex items-center space-x-2 flex flex-row">
              <a
                href="/marketplace"
                className="inline-flex flex flex-row space-x-2 items-center text-sm font-medium text-gray-700 hover:text-orange-600"
              >
                <HomeIcon
                  size={20}
                  color="grey"
                  className="me-2.5 hover:text-orange-500"
                />
                {home}
              </a>
            </li>
            {category && (
              <li>
                <div className="flex items-center">
                  <svg
                    className="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <a
                    href={`/marketplace?category=${category}`}
                    className="inline-flex ms-1 text-sm font-medium text-gray-700 hover:text-orange-600 md:ms-2 "
                  >
                    <Layers2 size={20} color="grey" className="me-2.5" />
                    {category}
                  </a>
                  <a
                    href={`/marketplace?category=${category}`}
                    className="inline-flex ms-1 text-sm font-medium text-gray-700 hover:text-orange-600 md:ms-2 "
                  >
                    <Layers2 size={20} color="grey" className="me-2.5" />
                    {subcategory}
                  </a>
                </div>
              </li>
            )}
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="rtl:rotate-180  w-3 h-3 mx-1 text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">
                  {productname}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default BreadCrump;
