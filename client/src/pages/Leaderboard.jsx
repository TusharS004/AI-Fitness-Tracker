import React from "react";
import { useState, useEffect } from "react";

const Leaderboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full min-h-screen overflow-hidden bg-gray-100 p-4 flex flex-col items-center mt-16">
        <p>LeaderBoard</p>
      <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-8">
        {/* Winners Section */}
        <div className="flex flex-row items-center gap-4 w-full lg:w-2/3">
          <div className="bg-gray-300 w-1/3 h-40 flex flex-col items-center justify-end rounded-xl p-2">
            <img src="dummy.jpg" alt="Robert" className="w-16 h-16 rounded-full" />
            <p>Robert</p>
            <p>2nd</p>
            <p>1200 Pts</p>
          </div>
          <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 w-1/3 h-48 flex flex-col items-center justify-end rounded-xl p-2">
            <img src="dummy.jpg" alt="Brook" className="w-20 h-20 rounded-full" />
            <p>Brook</p>
            <p>1st</p>
            <p>1500 Pts</p>
          </div>
          <div className="bg-orange-300 w-1/3 h-32 flex flex-col items-center justify-end rounded-xl p-2">
            <img src="dummy.jpg" alt="Darrell" className="w-14 h-14 rounded-full" />
            <p>Darrell</p>
            <p>3rd</p>
            <p>500 Pts</p>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="w-full lg:w-1/3 bg-gray-500 p-4 rounded-lg text-white">
          <div className="flex justify-between border-b pb-2 mb-10">
            <p>Name</p>
            <p>Place</p>
            <p>Points</p>
          </div>
          <div className="mt-2 flex flex-col gap-8">
            <div className="flex justify-between">
              <img src="dummy.jpg" alt="Cody Fisher" className="w-10 h-10 rounded-full" />
              <p>Cody Fisher</p>
              <p>1</p>
              <p>1500</p>
            </div>
            <div className="flex justify-between">
              <img src="dummy.jpg" alt="Kathryn Murphy" className="w-10 h-10 rounded-full" />
              <p>Kathryn Murphy</p>
              <p>2</p>
              <p>1200</p>
            </div>
            <div className="flex justify-between">
              <img src="dummy.jpg" alt="Kristin Watson" className="w-10 h-10 rounded-full" />
              <p>Kristin Watson</p>
              <p>3</p>
              <p>500</p>
            </div>
            <div className="flex justify-between">
              <img src="dummy.jpg" alt="Jerome Bell" className="w-10 h-10 rounded-full" />
              <p>Jerome Bell</p>
              <p>4</p>
              <p>300</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
