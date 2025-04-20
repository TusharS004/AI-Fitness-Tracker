import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Backend_Uri } from "../../config.js";

export default function Details() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    dob: "",
    gender: "Male", // Default value
    weight: "",
    height: "",
    dailyCalorieGoal: "",
    fitnessGoal: "",
    activityLevel: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(formData);

      const response = await axios.post(
        `${Backend_Uri}/api/users/profile`,
        formData,
        { 
          withCredentials: true, // Important to send cookies with the request
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log(response.data);
      
      if (response.data.success) {
        // If token is returned in the response, update localStorage
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }
        
        // Show success message
        alert(response.data.message);
        
        // Navigate to next page
        navigate("/StudentRegister2/Image");
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Handle different types of errors
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        setError(error.response.data.message || "Server error. Please try again.");
        
        // If unauthorized, redirect to login
        if (error.response.status === 401) {
          alert("Your session has expired. Please log in again.");
          navigate("/login");
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request
        setError("Error submitting form. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Define activity level options
  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "light", label: "Lightly active (light exercise 1-3 days/week)" },
    { value: "moderate", label: "Moderately active (moderate exercise 3-5 days/week)" },
    { value: "active", label: "Active (hard exercise 6-7 days/week)" },
    { value: "veryActive", label: "Very active (very hard exercise & physical job)" }
  ];

  // Define fitness goal options
  const fitnessGoals = [
    { value: "loseWeight", label: "Lose Weight" },
    { value: "maintainWeight", label: "Maintain Weight" },
    { value: "gainWeight", label: "Gain Weight" },
    { value: "buildMuscle", label: "Build Muscle" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
      <div className="flex-1 p-6 lg:p-16 flex items-center">
        <div className="max-w-xl mx-auto lg:mx-20 lg:mt-0 md:mt-20">
          <h1 className="text-3xl lg:text-5xl font-semibold mb-4 text-center lg:text-left">
            Fitness Details{" "}
            <span className="block text-blue-700 mt-2">for your health journey</span>
          </h1>
          <p className="text-gray-600 mt-4 text-center lg:text-left text-sm lg:text-base">
            Help us customize your fitness and nutrition plan.
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 lg:mt-10 md:mt-0 sm:mt-0">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 lg:p-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form className="space-y-4 lg:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                Height (cm)
              </label>
              <input
                id="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                required
                min="1"
                max="300"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your height in cm"
              />
            </div>
            
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                required
                min="1"
                max="500"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your weight in kg"
              />
            </div>
            
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="dailyCalorieGoal" className="block text-sm font-medium text-gray-700 mb-1">
                Daily Calorie Goal
              </label>
              <input
                id="dailyCalorieGoal"
                type="number"
                value={formData.dailyCalorieGoal}
                onChange={handleChange}
                required
                min="500"
                max="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2000"
              />
            </div>
            
            <div>
              <label htmlFor="fitnessGoal" className="block text-sm font-medium text-gray-700 mb-1">
                Fitness Goal
              </label>
              <select
                id="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your fitness goal</option>
                {fitnessGoals.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Activity Level
              </label>
              <select
                id="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select your activity level</option>
                {activityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-md ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              } text-white`}
            >
              {isLoading ? "Saving..." : "Next"}
            </button>
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}