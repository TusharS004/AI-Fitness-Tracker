import React from 'react'
import { useEffect, useState } from 'react';
import man from '../assets/man.png'
import { FaArrowRight } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import img1 from '../assets/i1.png'
import img2 from '../assets/i2.png'
import img3 from '../assets/i3.png'
import img4 from '../assets/i4.png'
import img11 from '../assets/i11.png'
import { Play, ChevronRight, Award, Video, Activity } from "lucide-react";
import img22 from '../assets/i22.png'
import img33 from '../assets/i33.png'
import { useNavigate } from 'react-router-dom'

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
    name: "Sana",
    role: "Boxing Coach",
    img: img1,
  },
  {
    name: "Suhaib Khan",
    role: "Fitness Coach",
    img: img2,
  },
  {
    name: "Kavya",
    role: "Gym Coach",
    img: img3,
  },
  {
    name: "Addy ",
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
    title: "Reach Your Wellness Milestones: Expert Tips from Our Facility",
    img: img22,
  },
  {
    date: "21 FEBRUARY 2023",
    title: "Meet Your Workout Goals: Advice from Our Gym",
    img: img33,
  },
];

  const goToPage = () => {  
    window.open (
      'http://127.0.0.1:5001/',
      '_blank' 
    );
  }

function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()
  return (
    <div className='mt-16'>
    <section className="relative bg-gradient-to-br from-gray-100 to-gray-200 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight mb-6 transition-all duration-300">
                WORKOUT <span className="text-orange-500">WITH ME</span>
              </h2>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                <div className="bg-black text-white px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <Video className="text-orange-500" size={24} />
                    <div>
                      <p className="text-2xl font-bold">350+</p>
                      <p className="text-sm">Video Tutorials</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-600 text-white px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <Award className="text-yellow-300" size={24} />
                    <div>
                      <p className="text-2xl font-bold">500+</p>
                      <p className="text-sm">Free Workout Videos</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500 text-white px-6 py-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="text-white" size={24} />
                    <div>
                      <p className="text-2xl font-bold">4.95 km</p>
                      <p className="text-sm">Daily Average</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="group mt-10 bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg flex items-center gap-2 hover:bg-orange-600 transition-all duration-300 transform hover:translate-x-2"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={goToPage}
              >
                Get Started
                <ChevronRight
                  className={`transition-all duration-300 ${
                    isHovered ? "translate-x-1" : ""
                  }`}
                />
              </button>
            </div>

            {/* Right Content - Image */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-300"></div>
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                    alt="Workout"
                    className="rounded-2xl shadow-2xl w-full object-cover h-[400px] sm:h-[500px] transform transition-all duration-500 group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white bg-opacity-80 hover:bg-opacity-100 p-4 rounded-full shadow-xl transform transition-all duration-300 hover:scale-110 group-hover:scale-110">
                      <Play className="text-orange-500" size={32} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600 opacity-10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500 opacity-10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 opacity-5 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-500 opacity-5 rounded-full"></div>
        </div>
      </section>
    {/* <section className="relative bg-gray-100 p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between mt-15 h-screen">
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
    </section> */}



<section className="bg-gray-100 py-12 px-6 md:px-16">
        <div className="max-w-6xl text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Not sure where to start?
          </h2>
          <p className="text-gray-600 mt-2">
            Programs offer day-to-day guidance on an interactive calendar to
            keep you on track.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-8xl mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 text-white p-6 rounded-lg shadow-lg flex flex-col justify-between transition-transform duration-300 hover:scale-105"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-gray-300 mt-2">
                {feature.description}
              </p>
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
              <img
                src={coach.img}
                alt={coach.name}
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-3 right-3 p-2 bg-orange-500 rounded-full hover:bg-white transition-colors cursor-pointer">
                <FaTwitter className="text-white hover:text-orange-500" />
              </div>
              <div className="p-4 text-center">
                <p className="text-sm text-orange-500 uppercase tracking-wide">
                  {coach.role}
                </p>
                <h3 className="text-lg font-bold text-white mt-1">
                  {coach.name}
                </h3>
                <div className="w-full h-1 mt-2 bg-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-200 py-12 sm:py-16 px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center">
            LATEST BLOGS
          </h2>

          {/* Grid Layout for Blog Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-center">
            {blogPosts.map((post, index) => (
              <div
                key={index}
                className="shadow-lg rounded-lg overflow-hidden w-full max-w-xs"
              >
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-48 sm:h-60 md:h-64 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm text-gray-500">{post.date}</p>
                  <h3 className="text-lg font-bold text-gray-900 mt-2">
                    {post.title}
                  </h3>
                  <div className="mt-2 w-full h-[1px] bg-gray-400"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Read More Button */}
          <div className="flex justify-center mt-10 sm:mt-16">
            <button onClick={() => navigate('./page3')} className="bg-orange-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-full text-base sm:text-lg font-semibold shadow-md hover:bg-orange-600 transition">
              READ MORE
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gray-200 h-120 flex items-center justify-center">
        <section className="bg-gray-800 text-white p-8 md:p-16 flex flex-col md:flex-row items-center justify-between h-100">
          <div className="md:w-1/3">
            <h2 className="text-5xl font-bold">
              What Our Member Say About Us?
            </h2>
            <div className="flex items-center mt-20">
              <img
                src="https://randomuser.me/api/portraits/men/1.jpg"
                alt="User1"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://randomuser.me/api/portraits/women/2.jpg"
                alt="User2"
                className="w-10 h-10 rounded-full border-2 border-white -ml-3"
              />
              <img
                src="https://randomuser.me/api/portraits/men/3.jpg"
                alt="User3"
                className="w-10 h-10 rounded-full border-2 border-white -ml-3"
              />
            </div>
            <p className="mt-2">10K+ Satisfied Customers</p>
          </div>
          <div className="md:w-2/3 md:h-50 bg-gray-900 p-6 rounded-lg shadow-lg relative">
            <p className="text-lg italic mt-5">
              “Join this fitness member, the best choice that I’ve. They're very
              professional and give you suggestions about what food and
              nutrition that you can eat.”
            </p>
            <div className="mt-4 flex items-center">
              <img
                src="https://randomuser.me/api/portraits/men/4.jpg"
                alt="Reviewer"
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-3">
                <p className="font-bold">Yash Sharma</p>
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