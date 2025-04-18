import React from 'react'
import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'

function Card({title , description, level, intensity}) {
  const [showModal, setShowModal] = useState(false)
    return (
    <>
    <div className="bg-gray-800 text-white p-4 rounded-xl shadow-lg w-full max-w-[300px]">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      <p className="text-sm mb-4">{description}</p>
      <div className="flex justify-between text-sm border-y border-gray-700 py-4 mt-8 mb-4">
        <span>Level: {level}</span>
        <span>Intensity: {intensity}</span>
      </div>
      <button className="mt-4 w-full py-2 bg-orange-400 hover:bg-gray-100 hover:text-black transition"
      onClick={() => setShowModal(true)}
      >
        More Details
      </button>
    </div>

    {/* Popup Modal */}
    {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-gray-800 text-white p-6 w-full max-w-sm h-[400px] relative flex flex-col justify-evenly">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-xl hover:text-orange-400"
              onClick={() => setShowModal(false)}
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-bold">{title}</h2>

            <div className="flex justify-between text-sm my-10">
              {/* <p>💰 Reward: {reward} Points</p> */}
              <p>📊 Level: {level}</p>
              <p>🔥 Intensity: {intensity}</p>
            </div>

            <p className="text-sm my-2">{description}</p>
            <button className="mt-4 w-full bg-orange-400 hover:bg-gray-100 text-white hover:text-black py-2 rounded-lg font-semibold">
              Start Challenge
            </button>
          </div>
        </div>
      )}
    </>  
  )
}

export default Card