import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Login failed.");

      // 2. Verify that the user has the 'platform_admin' role in the profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error("Unauthorized user record.");
      }

      if (profile.role !== "platform_admin") {
        await supabase.auth.signOut();
        throw new Error(
          "Access denied. This portal is strictly for platform administrators.",
        );
      }

      // 3. Success! Redirect to the admin dashboard
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C4C] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Secure Gateway
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-gray-950 tracking-tight">
            Platform Admin Login
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Sign in to access the InXern oversight control panel
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm leading-relaxed">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAdminLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@inxern.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] text-sm text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0F4C4C] text-sm text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0F4C4C] hover:bg-[#1A6363] text-white font-semibold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? "Verifying Credentials..." : "Sign In as Admin"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
