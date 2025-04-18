import React from 'react';
import page21 from '../assets/page21.png';

function Page2() {
  return (
    <div className="w-full max-w-8xl mx-auto text-center bg-gray-100 h-screen overflow-hidden relative">
      <div className="w-full h-screen relative">
        {/* Background Image */}
        <img
          src={page21}
          alt="Meditation"
          className="w-auto h-full min-w-full object-cover"
        />
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center items-center md:w-1/2 text-black text-center px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 p-4 rounded-lg">
            Yoga & Meditation to support your and <span className="text-purple-600">life of joy</span>
          </h1>
          <button className="px-6 py-3 bg-orange-500 text-white text-lg rounded-lg hover:bg-orange-600 transition">
            Start Meditation
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page2;
