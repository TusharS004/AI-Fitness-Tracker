import React from 'react';
import img from '../assets/i1.png';

const leaderboardData = [
  { name: 'Cody Fisher', place: 1, points: 1500, image: img },
  { name: 'Kathryn Murphy', place: 2, points: 1200, image: img },
  { name: 'Kristin Watson', place: 3, points: 500, image: img },
  { name: 'Jerome Bell', place: 4, points: 300, image: img },
  { name: 'Jerome Bell', place: 5, points: 300, image: img },
];

function LeaderboardTable() {
  return (
    <div className="bg-gray-200 rounded-lg p-4 mt-10">
      <div className="grid grid-cols-12 gap-4 mb-2 text-sm font-semibold">
        <div className="col-span-6">Name</div>
        <div className="col-span-3">Place</div>
        <div className="col-span-3">Points</div>
      </div>
      {leaderboardData.slice(0, 3).map((item, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-center py-2">
          <div className="col-span-6 flex items-center gap-2">
            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-full" />
            <span className="text-sm">{item.name}</span>
          </div>
          <div className="col-span-3 text-sm">{item.place}</div>
          <div className="col-span-3 text-sm">{item.points}</div>
        </div>
      ))}
      <div className="ml-5 font-bold text-center py-2 text-gray-500 flex flex-col gap-y-0">
        <div>.</div>
        <div>.</div>
        <div>.</div>
      </div>
      <div className="grid grid-cols-12 gap-4 items-center py-2">
        <div className="col-span-6 flex items-center gap-2">
          <img src={leaderboardData[3].image} alt={leaderboardData[3].name} className="w-8 h-8 rounded-full" />
          <span className="text-sm">{leaderboardData[3].name}</span>
        </div>
        <div className="col-span-3 text-sm">{leaderboardData[3].place}</div>
        <div className="col-span-3 text-sm">{leaderboardData[3].points}</div>
      </div>
    </div>
  );
}

export default LeaderboardTable;