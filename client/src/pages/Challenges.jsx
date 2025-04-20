import React from 'react'
import Card from '../components/Card'

function Challenges() {
    const cards = [
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        {
          title: "1. Cardio Blast",
          description:
            "Elevate your heart rate and improve cardiovascular health with our Cardio Blast classes. Choose from dance-inspired workouts to intense cardio circuits, all designed to boost stamina, torch calories, and leave you feeling energized.",
          level: "Beginner",
          intensity: "Low",
        },
        // Duplicate this object to add more cards
    ];
  return (
    <>
    {/* session tushar ne kha tha  */}
    <div className='mx-7 custom:mx-16'>
    <div className="w-full bg-gray-200 text-white p-6 rounded-lg border-2 border-black text-center custom:flex justify-between items-center gap-16 mt-20">
        <h2 className="text-xl text-black font-bold">🔥Today's Challenge</h2>
        <button className="mt-5 custom:mt-0 bg-orange-400 hover:bg-gray-100 text-white hover:text-black py-2 px-4 rounded-lg">
          Click Here
        </button>
        <p className="text-lg text-black font-bold custom:mt-0 mt-5">Your Points: 🏅 540</p>
    </div>
    </div>

    <div className="min-h-screen bg-gray-200 p-6 flex flex-wrap justify-center gap-16">
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
    </>
  )
}

export default Challenges;