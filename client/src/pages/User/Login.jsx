import { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Backend_Uri } from "../../config.js";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${Backend_Uri}/api/users/login`,
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        ("Login successful:", response.data);
        navigate("/dashboard");
      }
      window.location.reload();
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message;

        if (message === "Verify Otp") {
          ("OTP verification required.");
          navigate("/verificationpage");
        } else if (message === "Fill All the details") {
          ("User needs to complete registration.");
          navigate("/studentregister2");
        } else if (message === "Verify your image") {
          ("User needs to verify their image.");
          navigate("/studentregister2/image");
        } else {
          console.error("Server error:", message);
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Request error:", error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row">
      {/* Left Section */}
      <div className="flex-1 p-6 lg:p-16 flex items-center ml-10">
        <div className="max-w-xl mx-auto lg:mx-0">
          <h1 className="text-3xl lg:text-5xl font-semibold mb-4 text-center lg:text-left">
            Attendance
            <span className="block text-blue-700 mt-2">for your business</span>
          </h1>
          <p className="text-gray-600 mt-4 text-center lg:text-left text-sm lg:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet,
            itaque accusantium odio, soluta, corrupti aliquam quibusdam tempora
            at cupiditate quis eum maiores libero veritatis? Dicta facilis sint
            aliquid ipsum atque?
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({ ...formData, rememberMe: e.target.checked })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div> */}
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => navigate("./StudentRegister")}
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
