
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow dark:bg-gray-900 dark:text-white">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-semibold hover:underline">
          Student Progress Manager
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="hover:underline">
            Student Table
          </Link>
          <button
            onClick={() => setDark(!dark)}
            className="bg-white text-blue-600 px-3 py-1 rounded dark:bg-gray-700 dark:text-white"
          >
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
