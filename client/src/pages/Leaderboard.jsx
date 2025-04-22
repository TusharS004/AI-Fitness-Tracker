import React from "react";
import LeaderboardTabs from '../components/LeaderBoardTabs';
import LeaderboardPodium from '../components/LeaderBoardPodium';
import LeaderboardTable from '../components/LeaderBoardTable';
import ChallengesSection from '../components/ChallengesSection';
import { useState, useEffect } from "react";

const Leaderboard = () => {
  const points = 540;
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 mt-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-y-5 justify-between items-center mb-6 w-full">
          <LeaderboardTabs />
          <div className="bg-gray-200 rounded-lg px-4 py-2 w-30">
            Your Points: ⭐ {points}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LeaderboardPodium />
          </div>
          <div className="lg:col-span-1">
            <LeaderboardTable />
          </div>
        </div>

        <ChallengesSection />
      </div>
    </div>
  );
};

export default Leaderboard;
