import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">YouShare</h2>
            <p className="text-sm text-gray-400">
              A platform for sharing knowledge and connecting with fellow students
            </p>
          </div>
          
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} YouShare. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
