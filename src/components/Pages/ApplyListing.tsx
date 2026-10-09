import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ListingDetail } from "./ListingDetail";
import { useApplyListing } from "../../hooks/useApplyListing";

export const ApplyListing = () => {
  const {
    listedData,
    resumeLink,
    setResumeLink,
    message,
    setMessage,
    feedback,
    setFeedback,
    isSubmitted,
    setIsSubmitted,
    manageSubmitForm,
  } = useApplyListing();

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] pb-12 font-sans">
      {/* Navigation Space */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <Link
          to="../"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <span className="mr-2">&larr;</span> Back to listing
        </Link>

        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">
            Apply for {listedData?.title}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {listedData?.organizations.name}
          </p>
        </div>
      </div>

      {/* Main Card Form */}
      <main className="max-w-2xl mx-auto px-4">
        <form
          className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6"
          onSubmit={manageSubmitForm}
        >
          {/* Resume / CV Link Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Resume / CV link
            </label>
            <input
              type="url"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              required
              placeholder="https://drive.google.com/your-resume"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm placeholder-gray-400 text-gray-800 transition-all"
            />
          </div>

          {/* Short Message Textarea */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Short message to the organization
            </label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell them who you are, why you're a good fit, and what excites you about this role. Keep it brief, 2–4 sentences."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm placeholder-gray-400 text-gray-800 transition-all resize-none"
            />
          </div>

          {/* Heads Up Warning Box */}
          <div className="bg-[#EBF3F0] rounded-xl p-4 text-xs text-[#1E293B]">
            <span className="font-bold text-[#064E3B]">Heads up:</span> Make
            sure your resume link is publicly accessible before submitting.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm transition-colors disabled:opacity-50"
            >
              Submit application
            </button>
          </div>
        </form>
      </main>
      {isSubmitted && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center space-y-4 max-w-xs w-full mx-4">
            <div className="w-10 h-10 border-4 border-[#D9A726] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-gray-800">
              Submitting your application...
            </p>
          </div>
        </div>
      )}

      {/* --- STATUS CARD MODAL (Success or Error Feedback) --- */}
      {feedback && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl font-bold">
              {isSubmitted ? "✓" : "!"}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-gray-900">
                {isSubmitted ? "Application Submitted!" : "Notice"}
              </h3>
              <p className="text-sm text-gray-600">{feedback}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFeedback(null);
                if (isSubmitted) navigate(-1); // Return back on successful submit
              }}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
