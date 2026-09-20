import { useState } from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      {/* Simple Brand Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold font-heading text-brand-teal">
          InXern
        </h1>
        <p className="text-sm text-brand-textMuted">
          Skills-Based Recruitment Platform
        </p>
        <Link to="/signup">
          <button className="bg-amber-100 py-6 px-6 w-50 rounded-lg">
            SignUp
          </button>
        </Link>
      </div>
    </div>
  );
};
