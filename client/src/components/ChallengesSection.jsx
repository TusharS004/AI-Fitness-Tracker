import React from 'react';
import img from '../assets/i1.png';


const challenges = [
  {
    title: 'Personal Training',
    image: img,
  },
  {
    title: 'Group Fitness Classes',
    image: img,
  },
  {
    title: 'Nutritional Guidance',
    image: img,
  },
  {
    title: 'Nutritional Guidance',
    image: img,
  },
  {
    title: 'Nutritional Guidance',
    image: img,
  },
];

function ChallengesSection() {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-6 underline">Upcoming Challenges</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {challenges.map((challenge, index) => (
          <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md h-72">
            <img
              src={challenge.image}
              alt={challenge.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <h3 className="text-md font-medium mb-2">{challenge.title}</h3>
              <button className="w-full mt-3 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChallengesSection;