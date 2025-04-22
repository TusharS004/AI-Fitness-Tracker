import React from 'react';

function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Logo Section */}
          <div className="mb-8 md:mb-0">
            <div className="flex flex-col items-left">
              <h1 className="text-[#FF6B00] text-3xl font-bold italic">PULSE</h1>
              <div className="py-2 text-sm">
                POWER FROM WITHIN
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            <div>
              <h3 className="text-gray-400 text-sm mb-4">CONTACT US</h3>
              <a href="mailto:hello@pulse.com" className="block mb-2 hover:text-[#FF6B00]">
                ady123@pulse.com
              </a>
              <a href="tel:+9076838196" className="block hover:text-[#FF6B00]">
                +91 9999888877
              </a>
              <div className="mt-4">
                <h3 className="text-gray-400 text-sm mb-2">FOLLOW US</h3>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-[#FF6B00]">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="#" className="hover:text-[#FF6B00]">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="hover:text-[#FF6B00]">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <h3 className="text-gray-400 text-sm mb-4">OUR LOCATION</h3>
              <div className="mb-6">
                <h4 className="font-medium mb-2">Chandigarh</h4>
                <p className="text-sm text-gray-400">
                  Block A,<br />
                  Sector-26, 160001 
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Rajpura</h4>
                <p className="text-sm text-gray-400">
                  Chitkara University,<br />
                  Rajpura, 140401
                </p>
              </div>
            </div>

            {/* Opening Hours */}
            <div>
              <h3 className="text-gray-400 text-sm mb-4">OPENING HOURS</h3>
              <div className="mb-6">
                <h4 className="font-medium mb-2">Monday-Friday</h4>
                <p className="text-sm text-gray-400">Our doors are open<br />06:00 - 22:00</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Weekends</h4>
                <p className="text-sm text-gray-400">Our doors are open<br />10:00 - 21:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;