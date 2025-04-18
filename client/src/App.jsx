import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react'
// import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import Header from './components/Header'
import Page2 from './pages/Page2'
import CreateAccount from './pages/CreateAccount'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'
import Leaderboard from './pages/Leaderboard'


function App() {

  return (
    <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/meditation" element={<Page2 />} />
        <Route path="/challenges" element={<Page4 />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
    </>
 )
}

export default App;
