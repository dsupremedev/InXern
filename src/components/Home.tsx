import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import markLogo from "../assets/images/markLogo.png";

export const Home: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F7F5] font-sans text-[#1A1A1A] flex flex-col justify-between">
      {/* 2. HERO SECTION */}
      <section className="bg-[#0F4C4C] text-white px-6 pt-12 pb-20">
        <div className="max-w-4xl mx-auto flex flex-col items-start gap-6 text-left">
          {/* Tagline Badge */}
          <div className="text-[#E0B93A] text-xs font-semibold px-3 py-1.5 rounded-md uppercase tracking-wider">
            Every opportunity, one place.
          </div>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
            Find your next <span className="text-[#C9A227]">opportunity</span>{" "}
            or post one.
          </h1>

          {/* Pitch Subtext */}
          <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed">
            InXern connects ambitious applicants with organizations offering
            jobs and internships across Africa and beyond.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
            <Link
              to="/browse"
              className="bg-[#C9A227] hover:bg-[#E0B93A] text-[#1A1A1A] font-semibold text-center px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              Browse listings
            </Link>
            <Link
              to="/signup"
              className="border border-white/30 hover:bg-white/10 text-white font-medium text-center px-6 py-3 rounded-xl transition-colors"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </section>

      {/* 3. STATS SECTION */}
      <section className="bg-[#F7F7F5] py-12 px-6 border-b border-[#E0E0E0]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              2,400+
            </p>
            <p className="text-xs text-[#5C5C5C] font-medium uppercase tracking-wider">
              Active listings
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              380+
            </p>
            <p className="text-xs text-[#5C5C5C] font-medium uppercase tracking-wider">
              Partner organizations
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
              14,000+
            </p>
            <p className="text-xs text-[#5C5C5C] font-medium uppercase tracking-wider">
              Applications placed
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">28</p>
            <p className="text-xs text-[#5C5C5C] font-medium uppercase tracking-wider">
              Countries represented
            </p>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="py-16 px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            How InXern works
          </h2>
          <p className="text-[#5C5C5C] text-sm md:text-base max-w-lg mx-auto">
            Whether you are looking for work or looking to hire, getting started
            takes less than two minutes.
          </p>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-sm flex items-start gap-5 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#E6F0F0] text-[#0F4C4C] flex items-center justify-center shrink-0 mt-1">
              {/* User Icon Placeholder */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="space-y-1 pr-12">
              <h3 className="text-base font-bold text-[#1A1A1A]">
                Create your account
              </h3>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                Sign up as an applicant or organization. Your profile is the
                foundation of every interaction on InXern.
              </p>
            </div>
            <span className="absolute right-6 top-6 text-3xl font-extrabold text-[#E0E0E0]/60 select-none">
              01
            </span>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-sm flex items-start gap-5 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#E6F0F0] text-[#0F4C4C] flex items-center justify-center shrink-0 mt-1">
              {/* Search Icon Placeholder */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="space-y-1 pr-12">
              <h3 className="text-base font-bold text-[#1A1A1A]">
                Discover or post
              </h3>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                Browse jobs and internships by type or publish your own listing
                visible to thousands of eager applicants.
              </p>
            </div>
            <span className="absolute right-6 top-6 text-3xl font-extrabold text-[#E0E0E0]/60 select-none">
              02
            </span>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-sm flex items-start gap-5 relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#E6F0F0] text-[#0F4C4C] flex items-center justify-center shrink-0 mt-1">
              {/* File Icon Placeholder */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="space-y-1 pr-12">
              <h3 className="text-base font-bold text-[#1A1A1A]">
                Apply or shortlist
              </h3>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">
                Applicants submit with a resume link and short message.
                Organizations review and update candidates in real time.
              </p>
            </div>
            <span className="absolute right-6 top-6 text-3xl font-extrabold text-[#E0E0E0]/60 select-none">
              03
            </span>
          </div>
        </div>
      </section>

      {/* 5. BUILT FOR ORGANIZATIONS SECTION */}
      <section className="bg-[#E6F0F0] py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">
            Built for organizations, too
          </h2>
          <p className="text-[#5C5C5C] text-sm md:text-base max-w-2xl leading-relaxed">
            Post internships and full-time roles in minutes. Manage all your
            listings from one dashboard, review applicants, and update their
            status all without leaving InXern.
          </p>

          <ul className="space-y-3 pt-2">
            {[
              "Unlimited listing posts",
              "Applicant tracking with status updates",
              "Real-time applicant profile preview",
              "Edit or close listings anytime",
            ].map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-sm text-[#1A1A1A] font-medium"
              >
                <div className="w-5 h-5 rounded-full bg-[#0F4C4C] text-white flex items-center justify-center text-xs shrink-0">
                  ✓
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <Link
              to="/signup"
              className="inline-block bg-[#0F4C4C] hover:bg-[#1A6363] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              Post your first listing
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION CONTAINER */}
      <section className="py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="bg-[#0F4C4C] rounded-3xl p-8 md:p-12 text-center text-white space-y-6 shadow-md">
          <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
            Every opportunity, one place.
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto">
            Join thousands of applicants and organizations already using InXern.
          </p>
          <div>
            <Link
              to="/signup"
              className="inline-block bg-[#C9A227] hover:bg-[#E0B93A] text-[#1A1A1A] text-sm font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Get started it is free
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-brand-bg-tint text-white/70 py-10 px-6 border-t border-white/10 text-center text-xs space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 p-2 rounded  flex items-center justify-center font-bold text-[#0F4C4C] text-xs">
            <img src={markLogo} alt="logo" className="" />
          </div>
        </div>

        <p className="text-brand-text-dark">
          Copyright InXern All rights reserved.
        </p>

        <div className="flex justify-center gap-6 text-brand-text-dark font-medium pt-2">
          <Link
            to="/browse"
            className="hover:text-brand-teal-hover transition-colors"
          >
            Privacy
          </Link>
          <Link
            to="/browse"
            className="hover:text-brand-teal-hover transition-colors"
          >
            Terms
          </Link>
          <Link
            to="/browse"
            className="hover:text-brand-teal-hover transition-colors"
          >
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
};
