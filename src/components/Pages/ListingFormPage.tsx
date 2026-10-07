import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useListingManagement } from "../../hooks/useListingManagement";
import { SkillsPicker } from "../common/SkillsPicker";

export const ListingFormPage = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const {
    title,
    setTitle,
    description,
    setDescription,
    type,
    setType,
    deadline,
    setDeadline,
    requirements,
    setRequirements,
    loading,
    error,
    saveListing,
    hasApplicants, // Provided by your hook
  } = useListingManagement(id);

  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await saveListing("draft");
    if (res.success) {
      setFeedback("Listing saved as draft successfully!");
      setTimeout(() => navigate("/org/dashboard"), 1500);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation: Ensure at least one required skill
    // const hasRequired = requirements.some(
    //   (r) => r.requirement_type === "required",
    // );
    // if (!hasRequired) {
    //   alert("A published listing must have at least one 'Required' skill.");
    //   return;
    // }

    const res = await saveListing("published");
    if (res.success) {
      setFeedback("Listing published successfully!");
      setTimeout(() => navigate("/org/dashboard"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] pb-12 font-sans">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <Link
          to="/org/dashboard"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <span className="mr-2">&larr;</span> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? "Edit Listing" : "Create New Listing"}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Define your opportunity details and required skill criteria.
        </p>
      </div>

      <main className="max-w-2xl mx-auto px-4">
        {/* Listing Lock Notice */}
        {hasApplicants && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm leading-relaxed shadow-sm">
            🔒 <strong>Listing Locked:</strong> This listing has already
            received applications. Core content details are locked to protect
            candidate terms.
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}
        {feedback && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-sm">
            {feedback}
          </div>
        )}

        <form className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Listing Title
            </label>
            <input
              type="text"
              value={title}
              disabled={hasApplicants}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Junior React Frontend Intern"
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm text-gray-800 ${
                hasApplicants
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>

          {/* Type & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Opportunity Type
              </label>
              <select
                value={type}
                disabled={hasApplicants}
                onChange={(e) =>
                  setType(e.target.value as "job" | "internship")
                }
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm text-gray-800 bg-white ${
                  hasApplicants
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
              >
                <option value="internship">Internship</option>
                <option value="job">Full-time Job</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                disabled={hasApplicants}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm text-gray-800 ${
                  hasApplicants
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Description
            </label>
            <textarea
              rows={5}
              value={description}
              disabled={hasApplicants}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Describe the role, responsibilities, and expectations..."
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm text-gray-800 resize-none ${
                hasApplicants
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : ""
              }`}
            />
          </div>

          {/* Skills Picker Component */}
          <div
            className={hasApplicants ? "opacity-75 pointer-events-none" : ""}
          >
            <SkillsPicker
              selectedSkills={requirements}
              onChange={setRequirements}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            {!hasApplicants && (
              <button
                type="button"
                disabled={loading}
                onClick={handleSaveDraft}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Save as Draft
              </button>
            )}
            <button
              type="button"
              disabled={loading || hasApplicants}
              onClick={handlePublish}
              className={`px-6 py-2.5 rounded-xl text-gray-900 font-semibold text-sm transition-colors ${
                hasApplicants
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#D9A726] hover:bg-[#c49520]"
              }`}
            >
              {loading
                ? "Saving..."
                : hasApplicants
                  ? "Listing Locked"
                  : "Publish Listing"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
