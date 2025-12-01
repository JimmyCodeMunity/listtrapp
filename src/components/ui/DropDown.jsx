// // src/components/ui/dropdown.jsx
// import React, { useState, useRef, useEffect } from "react";

// import { ChevronDown } from "lucide-react";
// import clsx from "clsx";

// export const Dropdown = ({ label, options, onSelect, selected }) => {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   console.log("sel", onSelect?.value);

//   const toggleDropdown = () => setOpen((prev) => !prev);

//   const handleClickOutside = (e) => {
//     if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//       setOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSelect = (value) => {
//     onSelect?.(value);
//     setOpen(false);
//   };

//   return (
//     <div className="relative inline-block text-left" ref={dropdownRef}>
//       <p
//         className="flex items-center gap-2 cursor-pointer"
//         onClick={toggleDropdown}
//       >
//         {label}
//         <ChevronDown className="w-4 h-4" />
//       </p>

//       {open && (
//         <div className="absolute right-0 left-10 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
//           <div className="py-1">
//             {options.map((opt, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => handleSelect(opt.value)}
//                 className={clsx(
//                   "block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-black"
//                 )}
//               >
//                 {opt.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// src/components/ui/Dropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export const Dropdown = ({ label, options, onSelect, selected, direction }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onSelect?.(value);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <p
        className="flex items-center gap-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        {selected || label}
        <ChevronDown className="w-4 h-4" />
      </p>

      {open && (
        <div
          className={`absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ${
            direction === "left" ? "right-10" : "left-10"
          }`}
        >
          <div className="py-1">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(opt.value)}
                className={clsx(
                  "block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 hover:text-black",
                  selected === opt.value && "bg-gray-100 font-semibold"
                )}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
