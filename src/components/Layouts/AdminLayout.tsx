import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navLinks = [
    { to: "/admin/dashboard", label: "Organizations" },
    { to: "/admin/listings", label: "All Listings" },
    { to: "/admin/skills", label: "Manage Skills" },
    { to: "/admin/tests", label: "Algorithm Tests" },
    { to: "/admin/security-tests", label: "Security Tests" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-[#1E293B]">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-col justify-between hidden md:flex">
        <div className="p-6 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C4C] bg-emerald-50 px-2.5 py-1 rounded-md">
              Platform Admin
            </span>
            <h2 className="text-xl font-extrabold text-gray-900 mt-2">
              InXern Command
            </h2>
          </div>
          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-xl transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header & Slide-out Drawer */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle mobile menu"
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
            <span className="font-bold text-sm text-[#0F4C4C]">
              InXern Command
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-red-600 font-semibold"
          >
            Sign Out
          </button>
        </header>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 space-y-2 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
