import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProfilePage = () => {
  const { user, profile } = useAuth();

  const getInitials = () => {
    const name = profile?.full_name || "USER";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-500 font-medium">
              View your basic account information.
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition-colors"
          >
            &larr; Go Back
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            {/* Large Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#1A6363] flex items-center justify-center font-bold text-3xl shadow-sm">
              <span className="text-[#C9A227]">{getInitials()}</span>
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.full_name || "Unknown User"}
              </h2>
              <p className="text-sm font-medium text-gray-500 capitalize">
                {profile?.role?.replace("_", " ")} Account
              </p>
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Account Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    {profile?.full_name || "N/A"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                    {user?.email || "N/A"}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Role
                  </label>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 capitalize">
                    {profile?.role?.replace("_", " ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Applicant Action */}
            {profile?.role === "applicant" && (
              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <Link
                  to="/skill-profile"
                  className="px-6 py-2.5 bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm rounded-xl transition-colors"
                >
                  Manage Skills Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
