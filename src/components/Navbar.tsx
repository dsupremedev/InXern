import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-[#FFFFFF] border-b border-[#1A6363] px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-[150px]" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/browse"
            className="text-brand-teal hover:text-brand-teal-hover text-sm font-medium transition-colors"
          >
            Browse Listings
          </Link>
          <Link
            to="/login"
            className="text-brand-teal hover:text-brand-teal-hover text-sm font-medium transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-[#C9A227] hover:bg-[#E0B93A] text-[#1A1A1A] text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Sign up free
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-black focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#1A6363] flex flex-col gap-3">
          <Link
            to="/browse"
            className="text-brand-teal text-sm font-medium py-1"
          >
            Browse Listings
          </Link>
          <Link
            to="/login"
            className="text-brand-teal text-sm font-medium py-1"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-[#C9A227] text-[#1A1A1A] text-center text-sm font-semibold py-2 rounded-xl"
          >
            Sign up free
          </Link>
        </div>
      )}
    </nav>
  );
};
