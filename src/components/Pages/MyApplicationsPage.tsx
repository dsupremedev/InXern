import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { ApplicationItem } from "../../hooks/useApplications";
import { useApplications } from "../../hooks/useApplications";

export const MyApplicationsPage = () => {
  const { applications, loading, error, withdrawApplication } =
    useApplications();
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const handleWithdraw = async (id: string) => {
    if (!window.confirm("Are you sure you want to withdraw this application?"))
      return;
    setWithdrawingId(id);
    await withdrawApplication(id);
    setWithdrawingId(null);
  };

  // Helper for status badge colors
  const getStatusBadgeClass = (status: ApplicationItem["status"]) => {
    switch (status) {
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Under Review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Shortlisted":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "Withdrawn":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] pb-12 font-sans">
      {/* Header Space */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <span className="mr-2">&larr;</span> Back to listings
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-sm text-gray-500 font-medium">
          Track the status and history of your submitted internship
          applications.
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 space-y-4">
        {loading && (
          <div className="text-center py-12 text-sm text-gray-500">
            Loading your applications...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && applications.length === 0 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center space-y-3">
            <p className="text-gray-600 font-medium text-sm">
              You haven't applied to any listings yet.
            </p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm rounded-xl transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        )}

        {!loading &&
          applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {app.listing?.title || "Opportunity"}
                  </h2>
                  <p className="text-sm font-medium text-gray-500">
                    {app.listing?.organizations?.name || "Organization"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(app.status)}`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    Match: {app.match_score}%
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 flex flex-wrap gap-x-6 gap-y-1 pt-2 border-t border-gray-50">
                <span>
                  Applied on: {new Date(app.applied_at).toLocaleDateString()}
                </span>
                <a
                  href={app.resume_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:underline font-medium"
                >
                  View Submitted Resume &rarr;
                </a>
              </div>

              {/* Actions / Withdraw option */}
              {app.status !== "Withdrawn" &&
                app.status !== "Hired" &&
                app.status !== "Rejected" && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      disabled={withdrawingId === app.id}
                      onClick={() => handleWithdraw(app.id)}
                      className="px-4 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                    >
                      {withdrawingId === app.id
                        ? "Withdrawing..."
                        : "Withdraw Application"}
                    </button>
                  </div>
                )}
            </div>
          ))}
      </main>
    </div>
  );
};
