import React from "react";
import { useOrgSetup } from "../../hooks/useOrgSetup";

export const OrgSetupPage = () => {
  const { orgName, setOrgName, loading, error, handleSetup } = useOrgSetup();

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center px-4 font-sans text-[#1E293B]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Setup Organization
        </h1>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Before you can post opportunities, we need to register your
          organization's profile on the platform.
        </p>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSetup} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="orgName"
              className="block text-sm font-semibold text-gray-900"
            >
              Organization Name
            </label>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Acme Corp"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1A6363] text-sm text-gray-800"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Registering..." : "Complete Setup"}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Note: New organizations are placed in a <strong>pending</strong>{" "}
            state and must be approved by a platform admin before publishing
            listings.
          </p>
        </form>
      </div>
    </div>
  );
};
