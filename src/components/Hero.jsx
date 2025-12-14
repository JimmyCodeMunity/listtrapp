import React from "react";
import { Search, Smartphone, Shirt, Home, Sparkles, Dumbbell, BookOpen } from "lucide-react";

const Hero = () => {
  const categories = [
    { name: "Electronics", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
    { name: "Fashion", icon: Shirt, color: "bg-pink-100 text-pink-600" },
    { name: "Home & Living", icon: Home, color: "bg-green-100 text-green-600" },
    { name: "Beauty", icon: Sparkles, color: "bg-purple-100 text-purple-600" },
    { name: "Sports", icon: Dumbbell, color: "bg-orange-100 text-orange-600" },
    { name: "Books", icon: BookOpen, color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
          Discover Amazing
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
            Products Everyday
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Shop millions of products from top sellers. Fast delivery, great prices, and secure shopping.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
            <input
              type="text"
              placeholder="Search for products, brands, and more..."
              className="w-full pl-14 pr-6 md:py-5 py-3 text-lg rounded-full shadow-xl border border-gray-200 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-400 transition-all"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-orange-600 hover:bg-orange-700 text-white md:px-8 px-3 md:py-3 py-2 rounded-full font-semibold transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="group cursor-pointer bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="p-8">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${cat.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <cat.icon size={40} />
                  </div>
                  <p className="font-semibold text-gray-800">{cat.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


// import React from "react";
// import { Search, Smartphone, Shirt, Home, Sparkles, Dumbbell, BookOpen, ChevronRight } from "lucide-react";

// const Hero = () => {
//   const categories = [
//     { name: "Electronics", icon: Smartphone },
//     { name: "Fashion", icon: Shirt },
//     { name: "Home & Living", icon: Home },
//     { name: "Beauty", icon: Sparkles },
//     { name: "Sports", icon: Dumbbell },
//     { name: "Books", icon: BookOpen },
//   ];

//   return (
//     <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-r from-orange-600 to-amber-500 text-white">
//       {/* Asymmetric decorative overlay */}
//       <div className="absolute inset-0">
//         <div className="absolute top-0 right-0 w-3/4 h-full bg-white/10 skew-x-12"></div>
//         <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white/20 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
//         {/* Left: Text + Search */}
//         <div className="space-y-8">
//           <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
//             Find Everything You Need in One Place
//           </h1>
//           <p className="text-xl opacity-90 max-w-lg">
//             Explore thousands of products from trusted sellers with unbeatable prices and fast shipping.
//           </p>

//           {/* Large centered search */}
//           <div className="max-w-xl">
//             <div className="relative">
//               <Search className="absolute left-6 top-1/2 -translate-y-1/2" size={28} />
//               <input
//                 type="text"
//                 placeholder="What are you looking for today?"
//                 className="w-full pl-16 pr-6 py-6 text-gray-900 text-lg rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/50"
//               />
//               <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-orange-600 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition">
//                 Search
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Right: Vertical category list */}
//         <div className="space-y-4">
//           <h2 className="text-3xl font-bold mb-8">Popular Categories</h2>
//           {categories.map((cat) => (
//             <div
//               key={cat.name}
//               className="group flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer"
//             >
//               <div className="flex items-center gap-5">
//                 <div className="p-4 bg-white/20 rounded-xl group-hover:scale-110 transition">
//                   <cat.icon size={32} />
//                 </div>
//                 <span className="text-xl font-semibold">{cat.name}</span>
//               </div>
//               <ChevronRight size={28} className="opacity-70 group-hover:translate-x-2 transition" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;