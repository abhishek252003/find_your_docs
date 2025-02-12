import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Upload, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">StudoDoc</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search documents..."
                className="w-64 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <Link
              to="/upload"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Link>

            <Link
              to="/profile"
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <User className="h-6 w-6" />
            </Link>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}