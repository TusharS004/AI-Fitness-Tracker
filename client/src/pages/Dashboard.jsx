import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts"
import { FaFire, FaHeartbeat, FaRunning, FaBed, FaDumbbell } from "react-icons/fa"
import { BsCheckCircleFill } from "react-icons/bs"
import axios from "axios"
import { useState, useEffect } from "react"
import { Backend_Uri } from "../config.js"



const activityData = [
  { name: "Mon", value: 20 },
  { name: "Tue", value: 25 },
  { name: "Wed", value: 30 },
  { name: "Thu", value: 50 },
  { name: "Fri", value: 25 },
  { name: "Sat", value: 20 },
  { name: "Sun", value: 15 },
]

const CircularProgress = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.hours, 0)
  let currentAngle = 0

  return (
    <div className="relative">
      <svg className="w-32 h-32">
        {data.map((item, index) => {
          const percentage = (item.hours / total) * 100
          const angle = (percentage / 100) * 360
          const x1 = Math.cos((currentAngle - 90) * (Math.PI / 180)) * 50 + 64
          const y1 = Math.sin((currentAngle - 90) * (Math.PI / 180)) * 50 + 64
          const x2 = Math.cos((currentAngle + angle - 90) * (Math.PI / 180)) * 50 + 64
          const y2 = Math.sin((currentAngle + angle - 90) * (Math.PI / 180)) * 50 + 64
          const largeArcFlag = angle > 180 ? 1 : 0

          currentAngle += angle

          return (
            <path key={index} d={`M 64,64 L ${x1},${y1} A 50,50 0 ${largeArcFlag},1 ${x2},${y2} Z`} fill={item.color} />
          )
        })}
        <circle cx="64" cy="64" r="40" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold">40hrs</div>
          <div className="text-xs text-gray-500">Stretching</div>
        </div>
      </div>
    </div>
  )
}

const progressData = [
  { name: "Cardio", hours: 30, color: "#4FD1C5" },
  { name: "Stretching", hours: 40, color: "#9F7AEA" },
  { name: "Treadmill", hours: 30, color: "#FC8181" },
  { name: "Strength", hours: 20, color: "#4299E1" },
]

export default function Dashboard() {

  const [userData, setUserData] = useState({
    name: "Tushar Singla",
    age: 25,
    weight: 75,
    height: 6.5,
    calorieGoal: 2000
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${Backend_Uri}/api/users/profile`, {
          withCredentials: true,
        });

        if (response.data) {
          setUserData(prevData => ({
            ...prevData,
            ...response.data
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 p-6 mt-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-gray-600">Good Morning</h2>
            <h1 className="text-2xl font-bold text-orange-600">{userData.name}</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Calories Card */}
            <div className="bg-rose-400 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-2">
                <FaFire />
                <span>Calories</span>
              </div>
              <div className="mt-2 text-sm opacity-80">Today - {userData.calorieGoal}</div>
              <div className="mt-2">Under</div>
            </div>

            {/* Heart Rate Card */}
            <div className="bg-violet-500 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-2">
                <FaHeartbeat />
                <span>Heart Rate</span>
              </div>
              <div className="flex items-baseline mt-4">
                <span className="text-3xl font-bold">110</span>
                <span className="ml-1">Bpm</span>
              </div>
            </div>
          </div>

          {/* Weekly Calendar */}
          <div className="bg-white rounded-3xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">This Week</h3>
              <span className="text-gray-500">4/7 Days</span>
            </div>
            <div className="grid grid-cols-7 gap-4">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day, index) => (
                <div key={day} className="flex flex-col items-center">
                  <div className="text-sm text-gray-600 mb-2">{day}</div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center 
                    ${index < 5 ? "bg-black text-white" : "bg-gray-100"}`}
                  >
                    {index < 5 && <BsCheckCircleFill />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Activity</h3>
                <select className="text-sm text-gray-500 bg-transparent">
                  <option>Weekly</option>
                </select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Progress Chart */}
            <div className="bg-white rounded-3xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Progress</h3>
                <select className="text-sm text-gray-500 bg-transparent">
                  <option>Weekly</option>
                </select>
              </div>
              <CircularProgress data={progressData} />
              <div className="mt-4 space-y-2">
                {progressData.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.hours} hrs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="bg-white rounded-3xl p-6">
          {/* Profile */}
          <div className="flex items-center gap-4 mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-06%20204041-4Rv3Wn7Sk9FiY8hkPbhXYHQS79SS5G.png"
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-semibold">{userData.name}</h3>
              <p className="text-sm text-gray-500">@Panjab, India</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 text-center mb-8">
            <div>
              <p className="text-xl font-bold">
                {userData.weight}<span className="text-sm font-normal"> kg</span>
              </p>
              <p className="text-sm text-gray-500">Weight</p>
            </div>
            <div>
              <p className="text-xl font-bold">
                {userData.height}<span className="text-sm font-normal"> cm</span>
              </p>
              <p className="text-sm text-gray-500">Height</p>
            </div>
            <div>
              <p className="text-xl font-bold">
                {userData.age}<span className="text-sm font-normal">/yo</span>
              </p>
              <p className="text-sm text-gray-500">Age</p>
            </div>
          </div>

          {/* Goals */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Your Goals</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaRunning className="text-blue-500" />
                  <div>
                    <p className="font-medium">Running</p>
                    <p className="text-sm text-gray-500">70km/90km</p>
                  </div>
                </div>
                <span className="text-blue-500">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaBed className="text-violet-500" />
                  <div>
                    <p className="font-medium">Sleeping</p>
                    <p className="text-sm text-gray-500">6hr/20hrs</p>
                  </div>
                </div>
                <span className="text-violet-500">60%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaDumbbell className="text-orange-500" />
                  <div>
                    <p className="font-medium">Weight Loss</p>
                    <p className="text-sm text-gray-500">7kg/10kg</p>
                  </div>
                </div>
                <span className="text-orange-500">60%</span>
              </div>
            </div>
          </div>

          {/* Monthly Progress */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Monthly Progress</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32">
                <svg className="transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="#F3F4F6" strokeWidth="8" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    stroke="#F97316"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="377"
                    strokeDashoffset="75.4"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">80%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 text-center mt-2">You have achieved 80% of your goal this month</p>
            </div>
          </div>

          {/* Scheduled */}
          <div>
            <h3 className="font-semibold mb-4">Scheduled</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">🧘‍♀️</div>
                  <div>
                    <p className="font-medium">Training - Yoga Class</p>
                    <p className="text-sm text-gray-500">Fitness</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">22 Mar</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">🏊‍♂️</div>
                  <div>
                    <p className="font-medium">Training - Swimming</p>
                    <p className="text-sm text-gray-500">Fitness</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">22 Mar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

