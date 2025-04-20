import React, { useState } from "react";
import { Backend_Uri } from "../../config";


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const isFormValid = Object.values(formData).every(value => value.trim() !== "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${Backend_Uri}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }),
        // Important: include credentials to allow cookies to be set
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      
      // Store token in localStorage if you want it available to JavaScript
      // (in addition to the httpOnly cookie that's set by the server)
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }
      
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({ firstName: "", lastName: "", email: "", phone: "", password: "", confirmPassword: "" });
      
      // Redirect to verification page or dashboard after short delay
      setTimeout(() => {
        window.location.href = '/verify-otp'; // Or wherever you want to redirect
      }, 2000);
      
    } catch (err) {
      setError(`Failed to create account: ${err.message}`);
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="bg-white w-full h-full flex flex-col md:flex-row p-8">
        <div className="flex-1 flex flex-col justify-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-500">Log in</a>
          </p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
              Account created successfully! OTPs have been sent to your email and phone.
            </div>
          )}
          
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="">
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Name" 
                className="p-2 border rounded-md w-full" 
                required 
              />
            </div>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Email address" 
              className="mt-4 p-2 border rounded-md w-full" 
              required 
            />
            <input 
              type="tel" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              placeholder="Phone Number" 
              className="mt-4 p-2 border rounded-md w-full" 
              required 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Password" 
                className="p-2 border rounded-md w-full" 
                required 
              />
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="Confirm your password" 
                className="p-2 border rounded-md w-full" 
                required 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Use 8 or more characters with a mix of letters, numbers & symbols</p>
            <div className="flex items-center mt-2">
              <input 
                type="checkbox" 
                id="show-password" 
                className="mr-2" 
                onChange={() => setShowPassword(!showPassword)} 
              />
              <label htmlFor="show-password" className="text-sm">Show password</label>
            </div>
            <button 
              type="submit" 
              className={`mt-4 w-full py-2 rounded-md ${isFormValid ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer text-white' : 'bg-gray-300 cursor-not-allowed'}`} 
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? "Creating account..." : "Create an account"}
            </button>
          </form>
          <a href="/login" className="block text-center text-blue-500 mt-4">Log in instead</a>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-100 p-8">
          <img src="/mnt/data/image.png" alt="Illustration" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default Signup;