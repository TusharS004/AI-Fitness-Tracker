import React from 'react';
import img from '../assets/i1.png';

const podiumData = [
  { place: '2nd', points: '1200 Pts', name: 'Yatharth', image: img, height: 'h-44' },
  { place: '1st', points: '1500 Pts', name: 'Aditya', image: img, height: 'h-60' },
  { place: '3rd', points: '500 Pts', name: 'Yash', image: img, height: 'h-36' },
];

function LeaderboardPodium() {
  return (
    <div className="flex gap-5 items-end justify-center space-x-4 h-[300px] mt-24 pb-5 tablet:w-9/12">
      {podiumData.map((item) => {
        const bgColor =
          item.place === '1st' ? 'bg-yellow-400' : item.place === '2nd' ? 'bg-gray-300' : 'bg-amber-600';
        
        return (
          <div key={item.place} className="flex flex-col items-center">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 rounded-full mb-2"
            />
            <p className="text-sm font-medium mb-2">{item.name}</p>
            <div className={`${bgColor} w-20 custom1:w-32 ${item.height} rounded-t-lg relative flex items-center justify-center pb-2`}>
              <div className="text-center">
                <div className="font-bold">{item.place}</div>
                <div className="text-sm">{item.points}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LeaderboardPodium;
