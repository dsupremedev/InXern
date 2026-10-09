import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setMessage("Password reset instructions have been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl">
              {message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handlePasswordReset}>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Sending link..." : "Send Reset Instructions"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-gray-600 hover:underline">
              &larr; Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
