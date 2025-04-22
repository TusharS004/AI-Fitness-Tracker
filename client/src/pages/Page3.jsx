import React from "react";
import { useEffect } from "react";
import "../App.css";
import img from "../assets/i22.png";
import { Play } from "lucide-react";

function Page3() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const categories = [
    {
      title: "GEAR",
      image:
        "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "ACCESSORIES",
      image:
        "https://images.unsplash.com/photo-1620188526357-ff08e03da266?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "ACTIVEWEAR",
      image:
        "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "SUPPLEMENTS",
      image:
        "https://images.unsplash.com/photo-1620231150904-a86b9802656a?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "EQUIPMENT",
      image:
        "https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?auto=format&fit=crop&q=80&w=800",
    },
  ];
  return (
    <>
      <section className="mt-16">
        <div className="min-h-screen bg-black text-white relative">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/70"></div>
          </div>

          {/* Content */}
          <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-[#e67e22] text-base md:text-xl mb-4">
                The #1 Workout Connection
              </p>

              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                Peak Performance.
                <br />
                Peak Results.
              </h1>

              <p className="text-gray-300 text-sm md:text-base mb-8 max-w-xl mx-auto">
                We work to build a better you, pushing beyond your limits and
                achieving greatness through dedication and perseverance.
              </p>

              <button className="bg-[#e67e22] text-white px-8 py-3 rounded-md text-xl font-bold hover:bg-[#d35400] transition-colors duration-300 mb-8">
                Start Training
              </button>

              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 border border-[#e67e22] rounded-full  text-[#e67e22] flex justify-center items-center">
                  <Play />
                </div>
                <p className="text-md text-gray-300">Watch Demo</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="min-h-screen relative">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?auto=format&fit=crop&q=80&w=1920"
              alt="Meditation background"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Header */}
          <div className="relative bg-gray-200 flex items-center justify-center text-white text-2xl font-bold gap-4 px-2 py-6">
            <div className="w-4 h-4 bg-[#e67e22] rounded-full"></div>
            <div className="bg-gray-200 text-center">
              <h1 className="text-xl tablet:text-4xl font-bold text-black">
                TAKE THE NEXT STEP TO FITNESS
              </h1>
            </div>
            <div className="w-4 h-4 bg-[#e67e22] rounded-full"></div>
          </div>

          {/* Main Content */}
          <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center px-6 md:px-12 lg:px-24">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                Yoga & Meditation
                <br />
                to support your and
                <br />
                <span className="text-[#8A2BE2]">life of joy</span>
              </h2>

              <button className="bg-[#e67e22] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#d35400] transition-colors duration-300 mt-6">
                Start Meditation
              </button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="min-h-90 bg-gray-100">
          {/* Header */}

          <div className="bg-gray-200 flex items-center justify-center text-white text-2xl font-bold gap-4 px-2 py-6">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <div className="bg-gray-200 text-center">
              <h1 className="text-xl tablet:text-4xl font-bold text-black">
                TAKE THE NEXT STEP TO{" "}
                <span className="text-[#e67e22]">PERFORMANCE</span>
              </h1>
            </div>
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          </div>

          {/* Categories Grid */}
          <div className="overflow-x-auto w-full">
            <div className="flex w-[300%] md:w-auto md:grid md:grid-cols-3 gap-0 flex-nowrap">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="relative w-[33.33%] md:w-auto aspect-square group cursor-pointer shrink-0"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent">
                    <h2 className="text-white text-xl md:text-2xl font-bold">
                      {category.title}
                    </h2>
                    <svg
                      className="w-6 h-6 text-white transform group-hover:translate-x-2 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="bg-gray-200 flex items-center justify-center text-white text-2xl font-bold gap-4 px-2 py-6">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="bg-gray-200 text-center">
            <h1 className="text-xl tablet:text-4xl font-bold text-black">
              MAKE YOUR SPOT ON THE LEADERBOARD
            </h1>
          </div>
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        </div>

        <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Weekly Leader Card */}
              <div className="bg-[#2a2a2a] rounded-[30px] p-8 transform rotate-[-5deg] h-[450px] mt-0 tablet:mt-10 transition-transform duration-300 hover:scale-105 hover:rotate-0">
                <div className="flex flex-col items-center justify-evenly h-full">
                  <img
                    src={img}
                    alt="Weekly Leader"
                    className="w-24 h-24 rounded-full mb-6"
                  />
                  <div className="flex flex-col items-center justify-evenly h-2/4">
                    <h2 className="text-white text-2xl font-bold mb-4">
                      Weekly Leader
                    </h2>
                    <p className="w-full h-0.5 bg-gray-400"></p>
                    <p className="text-gray-400 text-center text-sm leading-relaxed">
                      Lorem Ipsum Dolor Sit Amet,
                      <br />
                      Consectetur Adipiscing Elit.
                      <br />
                      Vestibulum Faucibus Interdum
                    </p>
                  </div>
                </div>
              </div>

              {/* Daily Leader Card */}
              <div className="bg-[#2a2a2a] rounded-[30px] p-8 transform scale-110 relative h-[450px] mt-0 tablet:mt-10 transition-transform duration-300 hover:scale-115 hover:rotate-0">
                <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="flex flex-col items-center justify-evenly h-full">
                  <img
                    src={img}
                    alt="Daily Leader"
                    className="w-24 h-24 rounded-full mb-6"
                    style={{ backgroundColor: "#ffb6c1" }}
                  />
                  <div className="flex flex-col items-center justify-evenly h-2/4">
                    <h2 className="text-white text-2xl font-bold mb-4">
                      Daily Leader
                    </h2>
                    <p className="w-full h-0.5 bg-gray-400"></p>
                    <p className="text-gray-400 text-center text-sm leading-relaxed">
                      Lorem Ipsum Dolor Sit Amet,
                      <br />
                      Consectetur Adipiscing Elit.
                      <br />
                      Vestibulum Faucibus Interdum
                      <br />
                      Nunc, Et Eleifend Neque Sagittis Et.
                    </p>
                  </div>
                </div>
              </div>

              {/* Monthly Leader Card */}
              <div className="bg-[#2a2a2a] rounded-[30px] p-8 transform rotate-[5deg] h-[450px] mt-0 tablet:mt-10 transition-transform duration-300 hover:scale-105 hover:rotate-0">
                <div className="flex flex-col items-center justify-evenly h-full">
                  <img
                    src={img}
                    alt="Monthly Leader"
                    className="w-24 h-24 rounded-full mb-6"
                  />
                  <div className="flex flex-col items-center justify-evenly h-2/4">
                    <h2 className="text-white text-2xl font-bold mb-4">
                      Monthly Leader
                    </h2>
                    <p className="w-full h-0.5 bg-gray-400"></p>
                    <p className="text-gray-400 text-center text-sm leading-relaxed">
                      Lorem Ipsum Dolor Sit Amet,
                      <br />
                      Consectetur Adipiscing Elit.
                      <br />
                      Vestibulum Faucibus Interdum
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-16">
              <button className="bg-[#e67e22] text-white font-bold py-4 px-12 rounded-lg text-xl">
                DARE TO LEAP
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Page3;
