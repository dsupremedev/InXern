import React from "react";
import { SignUp } from "./components/auth/SignUp";
export const App: React.FC = () => {
  return (
    <main className="min-h-screen bg-brand-pageBg text-brand-textDark font-sans flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Simple Brand Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold font-heading text-brand-teal">
            InXern
          </h1>
          <p className="text-sm text-brand-textMuted">
            Skills-Based Recruitment Platform
          </p>
        </div>

        {/* Form Container */}
        <SignUp />
      </div>
    </main>
  );
};
