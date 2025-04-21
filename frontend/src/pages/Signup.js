import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { LucideUser, LucideMail, LucideLock, LucidePhone, LucideHome, LucideCalendar, LucideUserCheck } from "lucide-react";
import Footer from "../components/Footer";
import '../components/Sidebar.css'; 
const Signup = () => {
  const [loaded, setLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneno: "",
    address: "",
    dob: "",
    password: "",
  });

  useEffect(() => {
    setTimeout(() => setLoaded(true), 200);
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Check if the email already exists before submitting the form
      const checkResponse = await axios.post("https://expensebackend-production.up.railway.app/api/auth/check-email", { email: formData.email });
  
      if (checkResponse.data.exists) {
        alert("Email is already registered. Please use another email.");
        return;
      }
  
      // Proceed with registration if email doesn't exist
      const response = await axios.post("https://expensebackend-production.up.railway.app/api/auth/register", formData);
      alert("Registration successful!");
  
      // Clear form after success
      setFormData({
        name: "",
        email: "",
        phoneno: "",
        address: "",
        dob: "",
        password: "",
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message); // Show duplicate email error
      } else {
        alert("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };
  

  return (
    <>
      <div className={`flex min-h-screen bg-gray-900 transition-all duration-1000 ease-out ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
        {/* Left Side - Fullscreen Image with Overlay */}
        <div className="hidden lg:flex w-1/2 items-center justify-center relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 transition-all duration-1000 ease-in-out transform hover:scale-105">
          {/* Floating Gradient Circle for Depth */}
          <div className="absolute -top-20 -left-32 w-72 h-72 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 blur-3xl rounded-full"></div>

          {/* Content */}
          <div className="relative text-white text-left px-14 max-w-lg">
            {/* Finance Icon Animation */}
            <div className="flex items-center space-x-3 mb-6 animate-float">
              <div className="p-4 bg-gray-800 rounded-xl shadow-md transition-all hover:scale-110">
                <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h11M9 21V3m12 6H9m12 5H9m6 5h-6"></path>
                </svg>
              </div>
              <span className="text-xl font-semibold text-indigo-400">Smart Expense Management</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-extrabold leading-tight transition-all duration-700 hover:scale-105 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
              Take Control of <span className="text-indigo-400 animate-pulse">Your Finances</span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-lg opacity-90 animate-slide-in transition-all duration-700 hover:text-indigo-300 hover:scale-105 text-gray-200">
              Manage, track, and optimize your expenses with ease. Gain financial freedom and control your future with smart insights.
            </p>
          </div>
        </div>

        {/* Right Side - Compact Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 pt-24">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-md border border-gray-700 transform transition-all duration-700 ease-in-out hover:scale-[1.04] hover:shadow-lg">
            {/* Title */}
            <h2 className="text-3xl font-semibold text-center mb-5 text-white animate-slide-up">Create Account</h2>

            {/* Feature Icons */}
            <div className="flex justify-center space-x-4 mb-5">
              <div className="p-3 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-pulse hover:scale-110 shadow-md">
                <LucideUserCheck size={24} color="white" />
              </div>
              <div className="p-3 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-pulse delay-100 hover:scale-110 shadow-md">
                <LucideMail size={24} color="white" />
              </div>
              <div className="p-3 rounded-lg bg-gray-800 hover:bg-indigo-500 transition-all cursor-pointer animate-pulse delay-200 hover:scale-110 shadow-md">
                <LucideLock size={24} color="white" />
              </div>
            </div>

            {/* Input Fields */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <LucideUser className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02]"
                    required
                  />
                </div>

                <div className="relative">
                  <LucideMail className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02]"
                    required
                  />
                </div>

                <div className="relative">
                  <LucidePhone className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="phoneno"
                    placeholder="Phone"
                    value={formData.phoneno}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02]"
                    required
                  />
                </div>

                <div className="relative">
                  <LucideHome className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02]"
                    required
                  />
                </div>

                <div className="relative col-span-2">
                  <LucideCalendar className="absolute top-3 left-3 text-gray-400" size={18} />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02]"
                    required
                  />
                </div>
              </div>

              {/* Password Fields */}
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-4 w-full p-3 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-indigo-400 transition-all duration-300 hover:scale-[1.02]"
                required
              />

              {/* Register Button */}
              <button
                type="submit"
                className="relative w-full p-3 mt-6 bg-indigo-500 text-white rounded-md shadow-lg transition-all transform hover:scale-[1.05] hover:bg-indigo-600 active:scale-95"
              >
                <span className="relative z-10 text-lg font-semibold">REGISTER</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Signup;