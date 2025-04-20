import React, { useEffect, useState } from 'react';
import { FaBars, FaSearch, FaBell, FaSignOutAlt } from "react-icons/fa";
import axios from 'axios';
import {Backend_Uri} from '../config.js';

function Header() {
  // Initialize state from localStorage if available
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || null;
  });
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
    <header className="flex justify-between items-center p-4 bg-gray-200 shadow-md fixed top-0 z-10 w-full h-15">
      <h1 className="text-3xl font-bold text-orange-500 italic">PULSE</h1>
      
      <nav className="hidden md:flex gap-6 text-gray-700 text-lg">
        <a href="/">Home</a>
        <a href="/leaderboard">LeaderBoard</a>
        <a href="/meditation">Meditation</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/challenges">Challenges</a>
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
        <FaBars className="md:hidden text-gray-700 cursor-pointer" />
        
        {isLoggedIn && (
          <FaSignOutAlt 
            className="text-gray-700 cursor-pointer" 
            onClick={handleLogout} 
            title="Logout" 
          />
        )}
      </div>
    </header>
  );
}

export default Header;