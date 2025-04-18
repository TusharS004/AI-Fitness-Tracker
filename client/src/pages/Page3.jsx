import React from "react";
import gearImg from "../assets/i1.png"; // Replace with your actual image path
import accessoriesImg from "../assets/i1.png";
import activewearImg from "../assets/i1.png";
import nutritionImg from "../assets/i1.png";
import gadgetsImg from "../assets/i1.png";

const categories = [
  { title: "GEAR", image: gearImg },
  { title: "ACCESSORIES", image: accessoriesImg },
  { title: "ACTIVEWEAR", image: activewearImg },
  { title: "NUTRITION", image: nutritionImg },
  { title: "GADGETS", image: gadgetsImg },
];

function Page3() {
  return (
    <div className="w-full h-screen bg-gray-200 flex flex-col items-center text-white overflow-hidden">
      <h1 className="text-xl md:text-3xl my-10 font-bold text-center tracking-wide text-black">
        TAKE THE NEXT STEP TO PERFORMANCE
      </h1>
      
      <div className="relative w-full h-full overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex w-max h-full">
          {categories.map((category, index) => (
            <div key={index} className="w-[300px] md:w-[400px] lg:w-[500px] h-full flex-shrink-0 relative mx-2">
              <img src={category.image} alt={category.title} className="w-full h-full object-cover rounded-lg" />
              <div className="transform -translate-x-1/2 text-center">
                <p className="text-sm md:text-lg font-semibold uppercase">{category.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page3;
