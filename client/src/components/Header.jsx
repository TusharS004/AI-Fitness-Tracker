import React, { useEffect, useState } from 'react';
import { FaBars, FaSearch, FaBell, FaSignOutAlt } from "react-icons/fa";
import axios from 'axios';
import {Backend_Uri} from '../config.js';
import { User, Bell, Search, X, Home, Dumbbell, Heart, ShoppingBag, Trophy, Flag, Settings, HelpCircle } from 'lucide-react';


function Header() {
  // Initialize state from localStorage if available
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || null;
  });
  const [userEmail, setUserEmail] = useState(()=> {
    return localStorage.getItem('')
  })
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [isLoading, setIsLoading] = useState(!userName); // Only load if no userName

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoading) return; // Skip if we already have data from localStorage
      
      try {
        const response = await axios.get(`${Backend_Uri}/api/users/profile`, {
          withCredentials: true,
        });
        
        if (response.data && response.data.name) {
          // Update state and localStorage
          setUserName(response.data.name);
          setIsLoggedIn(true);
          localStorage.setItem('userName', response.data.name);
          localStorage.setItem('isLoggedIn', 'true');
        } else {
          // Clear localStorage if no valid data
          localStorage.removeItem('userName');
          localStorage.removeItem('isLoggedIn');
          setUserName(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('userName');
        localStorage.removeItem('isLoggedIn');
        setUserName(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, [isLoading]);

  const handleLogout = async () => {
    try {
      await axios.get(`${Backend_Uri}/api/users/logout`, {
        withCredentials: true,
      });
      
      // Clear both state and localStorage
      setUserName(null);
      setIsLoggedIn(false);
      localStorage.removeItem('userName');
      localStorage.removeItem('isLoggedIn');
      
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
    <header className="flex justify-between items-center p-4 bg-gray-200 shadow-md fixed top-0 z-10 w-full h-15">
      <h1 className="text-3xl font-bold text-orange-500 italic"><a href="/">PULSE</a></h1>
      
      <nav className="hidden md:flex gap-6 text-gray-700 text-lg">
          <a href="/dashboard">Dashboard</a>
          <a href="/challenges">Challenges</a>
          <a href="/leaderboard">LeaderBoard</a>
          <a href="/page3">Contact Us</a>
      </nav>
      
      <div className="flex gap-8 items-center text-lg">
        {userName ? (
          <span className="font-semibold text-orange-600">Hi, {userName}</span>
        ) : (
          <>
            <a href='/signup'>Signup</a>
            <a href='/login'>Login</a>
          </>
        )}
        
        <FaSearch className="text-gray-700 cursor-pointer" />
        <FaBell className="text-gray-700 cursor-pointer" />
        {/* <FaBars className="md:hidden text-gray-700 cursor-pointer" /> */}
        <button 
            onClick={() => setIsSidebarOpen(true)}
            className="  text-gray-700 cursor-pointer md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
        {isLoggedIn && (
          <FaSignOutAlt 
            className="text-gray-700 cursor-pointer" 
            onClick={handleLogout} 
            title="Logout" 
          />
        )}
      </div>
    </header>

    
    {isSidebarOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-30"
        onClick={() => setIsSidebarOpen(false)}
      />
    )}

    {/* Sidebar */}
    <div className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4">
        <a href='/' className='font-bold text-3xl text-orange-500 italic'>PULSE</a>

        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 p-4 bg-orange-100 rounded-lg mb-6 mt-8">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{userName}</h3>
            {/* <p className="text-sm text-gray-600">{userMail}</p> */}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          <SidebarLink icon={<Home size={20} />} label="Home" href='/'/>
          <SidebarLink icon={<Dumbbell size={20} />} label="Exercise" href="/notfound"/>
          <SidebarLink icon={<Heart size={20} />} label="Meditation" href="/page3"/>
          <SidebarLink icon={<ShoppingBag size={20} />} label="Market Place" href="/dashboard"/>
          <SidebarLink icon={<Trophy size={20} />} label="Leader Board" href='/leaderboard' />
          <SidebarLink icon={<Flag size={20} />} label="Challenges" href="/page4"/>
          
          <div className="border-t border-gray-200 my-4" />
          
          <SidebarLink icon={<Settings size={20} />} label="Settings" href="/notfound"/>
          <SidebarLink icon={<HelpCircle size={20} />} label="Support" />
        </nav>
      </div>
    </div>
    </>
  );
}


function SidebarLink({ icon, label, href }) {
  return (
    <a 
      href={href} 
      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}


export default Header;