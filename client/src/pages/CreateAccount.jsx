import React, { useState } from "react";

const CreateAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  
  const isFormValid = Object.values(formData).every(value => value.trim() !== "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="bg-white w-full h-full flex flex-col md:flex-row p-8">
        <div className="flex-1 flex flex-col justify-center p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-sm text-gray-600">
            Already have an account? <a href="#" className="text-blue-500">Log in</a>
          </p>
          <form className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First name" className="p-2 border rounded-md w-full" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last name" className="p-2 border rounded-md w-full" />
            </div>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email address" className="mt-4 p-2 border rounded-md w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="p-2 border rounded-md w-full" />
              <input type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" className="p-2 border rounded-md w-full" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Use 8 or more characters with a mix of letters, numbers & symbols</p>
            <div className="flex items-center mt-2">
              <input type="checkbox" id="show-password" className="mr-2" onChange={() => setShowPassword(!showPassword)} />
              <label htmlFor="show-password" className="text-sm">Show password</label>
            </div>
            <button type="submit" className={`mt-4 w-full py-2 rounded-md ${isFormValid ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer text-white' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!isFormValid}>Create an account</button>
          </form>
          <a href="#" className="block text-center text-blue-500 mt-4">Log in instead</a>
        </div>
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-100 p-8">
          <img src="/mnt/data/image.png" alt="Illustration" className="max-w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
