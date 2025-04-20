import React from 'react'
import man from '../assets/man.png'
import { FaArrowRight } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import img1 from '../assets/i1.png'
import img2 from '../assets/i2.png'
import img3 from '../assets/i3.png'
import img4 from '../assets/i4.png'
import img11 from '../assets/i11.png'
import img22 from '../assets/i22.png'
import img33 from '../assets/i33.png'

const features = [
    {
      title: "Workout Videos",
      description: "Access to hundreds of free, full-length workout videos.",
    },
    {
      title: "Workout Programs",
      description: "Affordable and effective workout programs.",
    },
    {
      title: "Meal Plans",
      description: "Plans built with registered dietitians and nutritionists.",
    },
    {
      title: "WO Plus ALL ACCESS",
      description: "Add powerful features to your membership.",
    },
  ];

  const coaches = [
    {
      name: "Sarah Anderson",
      role: "Boxing Coach",
      img: img1,
    },
    {
      name: "Mark Thompson",
      role: "Fitness Coach",
      img: img2,
    },
    {
      name: "Jessica Roberts",
      role: "Gym Coach",
      img: img3,
    },
    {
      name: "Michael Johnson",
      role: "Bodybuilding Coach",
      img: img4,
    },
  ];


  const blogPosts = [
    {
      date: "21 FEBRUARY 2023",
      title: "Achieve Your Fitness Goals: Insights from Our Center",
      img: img11,
    },
    {
      date: "21 FEBRUARY 2023",
      title: "Achieve Your Fitness Goals: Insights from Our Center",
      img: img22,
    },
    {
      date: "21 FEBRUARY 2023",
      title: "Achieve Your Fitness Goals: Insights from Our Center",
      img: img33,
    }
  ];

  const goToPage = () => {  
    window.open (
      'http://127.0.0.1:5001/',
      '_blank' 
    );
  }

function HomePage() {
  return (
    <div>
    <section className="relative bg-gray-100 p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between mt-15 h-screen">
      <div className="md:w-1/2">
        <h2 className="ml-10 text-9xl font-bold text-gray-900 leading-tight">WORKOUT WITH ME</h2>
        <div className="flex gap-4 mt-6 ml-10">
          <div className="bg-black text-white px-4 py-2 rounded-lg shadow-lg">
            <p className="text-lg font-bold">350+</p>
            <p className="text-sm">Video tutorial</p>
          </div>
          <div className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <p className="text-lg font-bold">500+</p>
            <p className="text-sm">Free Workout Videos</p>
          </div>
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg">
            <p className="text-lg font-bold">4.95 km</p>
          </div>
        </div>
        <button className="mt-6 ml-10 bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md" onClick={goToPage}>Get Started</button>
      </div>
      <div className="md:w-1/2 flex justify-center ml-10">
        <img
          src={man}
          alt="Workout"
          className="rounded-lg"
        />
      </div>
    </section>

    <section className="bg-gray-100 py-12 px-6 md:px-16">
      <div className="max-w-6xl text-left">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Not sure where to start?
        </h2>
        <p className="text-gray-600 mt-2">
          Programs offer day-to-day guidance on an interactive calendar to keep you on track.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-8xl mt-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between transition-transform duration-300 hover:scale-105"
          >
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-sm text-gray-300 mt-2">{feature.description}</p>
            <div className="flex justify-end mt-4">
              <FaArrowRight className="text-gray-400 hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </section>
    
    <section className="bg-black py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white">MEET THE PROS</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mt-12">
        {coaches.map((coach, index) => (
          <div
            key={index}
            className={`relative rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105`}
          >
            <img src={coach.img} alt={coach.name} className="w-full h-80 object-cover" />
            <div className="absolute top-3 right-3 p-2 bg-orange-500 rounded-full hover:bg-white transition-colors cursor-pointer">
              <FaTwitter className="text-white hover:text-orange-500" />
            </div>
            <div className="p-4 text-center">
              <p className="text-sm text-orange-500 uppercase tracking-wide">{coach.role}</p>
              <h3 className="text-lg font-bold text-white mt-1">{coach.name}</h3>
              <div className="w-full h-1 mt-2 bg-gray-600" />
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-gray-200 py-16 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-20">LATEST BLOGS</h2>

        {/* Grid Layout for Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <div key={index} className=" shadow-lg rounded-lg overflow-hidden w-80 h-120">
              <img src={post.img} alt={post.title} className="w-full h-80 object-cover" />
              <div className="p-4">
                <p className="text-sm text-gray-500">{post.date}</p>
                <h3 className="text-lg font-bold text-gray-900 mt-2">{post.title}</h3>
                <div className="mt-2 w-full h-[1px] bg-gray-400"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Read More Button */}
        <div className="flex justify-center mt-20">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-orange-600 transition">
            READ MORE
          </button>
        </div>
      </div>
    </section>

    <section className="bg-gray-200 h-120 flex items-center justify-center">
    <section className="bg-gray-800 text-white p-8 md:p-16 flex flex-col md:flex-row items-center justify-between h-100">
      <div className="md:w-1/3">
        <h2 className="text-5xl font-bold">What Our Member Say About Us?</h2>
        <div className="flex items-center mt-20">
          <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User1" className="w-10 h-10 rounded-full border-2 border-white" />
          <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="User2" className="w-10 h-10 rounded-full border-2 border-white -ml-3" />
          <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="User3" className="w-10 h-10 rounded-full border-2 border-white -ml-3" />
        </div>
        <p className="mt-2">10K+ Satisfied Customers</p>
      </div>
      <div className="md:w-2/3 md:h-50 bg-gray-900 p-6 rounded-lg shadow-lg relative">
        <p className="text-lg italic mt-5">“Join this fitness member, the best choice that I’ve. They're very professional and give you suggestions about what food and nutrition that you can eat.”</p>
        <div className="mt-4 flex items-center">
          <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Reviewer" className="w-12 h-12 rounded-full" />
          <div className="ml-3">
            <p className="font-bold">Jonathan Edward</p>
            <p className="text-sm text-gray-400">Office Worker</p>
          </div>
        </div>
        <div className="absolute top-4 right-4 text-yellow-400 flex gap-1">
          ★★★★★
        </div>
        <button className="absolute top-1/2 right-4 bg-white text-gray-900 p-2 rounded-full shadow-md">
          <FaArrowRight />
        </button>
      </div>
    </section>
    </section>
    

  </div>
  )
}

export default HomePage