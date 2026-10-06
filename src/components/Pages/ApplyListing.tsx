import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export interface ApplyFormUIProps {
  jobTitle?: string;
  organizationName?: string;
  location?: string;
  resumeLink?: string;
  message?: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
  onResumeLinkChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMessageChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

export const ApplyListing: React.FC<ApplyFormUIProps> = ({
  jobTitle = "Software Engineer — Backend",
  organizationName = "Meridian Labs",
  location = "Lagos, Nigeria",
  resumeLink: externalResumeLink,
  message: externalMessage,
  isSubmitting = false,
  errorMessage = null,
  onResumeLinkChange,
  onMessageChange,
  onSubmit,
  onCancel,
}) => {
  const navigate = useNavigate();

  // Internal local state fallback if props aren't passed from a parent hook/page
  const [internalResumeLink, setInternalResumeLink] = useState("");
  const [internalMessage, setInternalMessage] = useState("");

  const currentResumeLink = externalResumeLink ?? internalResumeLink;
  const currentMessage = externalMessage ?? internalMessage;

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onResumeLinkChange) {
      onResumeLinkChange(e);
    } else {
      setInternalResumeLink(e.target.value);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onMessageChange) {
      onMessageChange(e);
    } else {
      setInternalMessage(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1); // Go back to the previous page by default
    }
  };

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
            Apply for {jobTitle}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {organizationName} &middot; {location}
          </p>
        </div>
      </div>

      {/* Main Card Form */}
      <main className="max-w-2xl mx-auto px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6"
        >
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* Resume / CV Link Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Resume / CV link
            </label>
            <input
              type="url"
              required
              value={currentResumeLink}
              onChange={handleResumeChange}
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
              value={currentMessage}
              onChange={handleMessageChange}
              placeholder="Tell them who you are, why you're a good fit, and what excites you about this role. Keep it brief — 2–4 sentences."
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
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit application"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
