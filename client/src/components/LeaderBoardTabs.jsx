import React from 'react';

const tabs = ['Today', 'Weekly', 'Monthly', 'Yearly'];

function LeaderboardTabs() {
  return (
    <div className="flex gap-12 flex-wrap gap-y-5 align-center justify-center"> 
      {tabs.map((tab, index) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-lg w-32 ${
            index === 0 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default LeaderboardTabs;