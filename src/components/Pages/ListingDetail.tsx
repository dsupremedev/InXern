// import React from "react";
// import { Link } from "react-router-dom";
// import { useListingDetails } from "../../hooks/useListingDetails";
// import { formatDateWithOrdinal } from "../../hooks/useListingDetails";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// export const ListingDetail: React.FC = () => {
//   const navigate = useNavigate();

//   const manageApply = () => {
//     navigate(`/apply-listing/${listingDetails?.id}`);
//   };
//   const { listingDetails, matchScore, missingSkills, applicantSkills } =
//     useListingDetails();
//   const applicantCount = listingDetails?.applications?.[0]?.count ?? 0;

//   if (!listingDetails) {
//     return (
//       <div className="min-h-screen bg-[#F8F9FA] p-8 flex justify-center items-center">
//         <p className="text-gray-500">Loading listing details...</p>
//       </div>
//     );
//   }

//   // Placeholder static values until you plug in your match score calculation logic

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] pb-12 font-sans">
//       {/* Top Navigation / Header space */}
//       <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
//         <Link
//           to="/browse"
//           className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
//         >
//           <span className="mr-2">&larr;</span> Back to listings
//         </Link>
//       </div>

//       <main className="max-w-4xl mx-auto px-4 space-y-6">
//         {/* Main Listing Information Card */}
//         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
//           <div className="flex items-start gap-4">
//             {/* Organization / Company Logo Avatar */}
//             <div className="w-12 h-12 bg-[#064E3B] text-white font-bold text-xl rounded-xl flex items-center justify-center flex-shrink-0">
//               {listingDetails.title ? listingDetails.title.charAt(0) : "M"}
//             </div>

//             <div className="space-y-1">
//               <div className="flex items-center gap-2">
//                 <span className="capitalize bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//                   {listingDetails.type}
//                 </span>
//                 <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
//                   <span>★</span> Skills Match Score: {matchScore}%
//                 </span>
//               </div>

//               <h1 className="text-2xl font-bold text-gray-900 pt-1">
//                 {listingDetails.title}
//               </h1>
//               <p className="text-sm text-gray-500 font-medium">
//                 {listingDetails.organizations?.name}
//               </p>
//             </div>
//           </div>

//           <p className="text-xs text-gray-400 italic">
//             Reflects required skills coverage only, not overall fit.{" "}
//             <span className="font-semibold text-gray-600 not-italic">
//               Apply regardless of your score.
//             </span>
//           </p>

//           <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 pt-2 border-t border-gray-50">
//             {/* <div className="flex items-center gap-1.5">
//               <span>📍</span>
//               <span>Lagos, Nigeria</span> 3
//             </div> */}
//             <div className="flex items-center gap-1.5">
//               <span>📅</span>
//               <span>
//                 Deadline: {formatDateWithOrdinal(listingDetails.deadline)}
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span>👥</span>
//               <span>Applicants: {applicantCount}</span>
//             </div>
//           </div>

//           <div className="pt-4 border-t border-gray-50 space-y-3">
//             <h2 className="text-base font-bold text-gray-900">
//               About this role
//             </h2>
//             <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
//               {listingDetails.description}
//             </p>
//           </div>
//         </div>

//         {/* Skills Section */}
//         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
//           <h2 className="text-lg font-bold text-gray-900">Skills</h2>

//           {/* Banner notification */}
//           <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100 space-y-1">
//             <p className="text-xs font-semibold text-gray-700">
//               Required skills not on your profile: Node.js, PostgreSQL, Redis
//             </p>
//             <p className="text-xs text-gray-500">
//               Skills Match Score:{" "}
//               <span className="font-semibold">{matchScore}%</span>
//             </p>
//             <p className="text-[11px] text-gray-400 italic">
//               Reflects required skills coverage only, not overall fit.{" "}
//               <span className="font-semibold text-gray-600 not-italic">
//                 Apply regardless of your score.
//               </span>
//             </p>
//           </div>

//           {/* Skill Groups */}
//           <div className="space-y-4">
//             <div>
//               <p className="text-xs text-gray-500 font-medium mb-2">Required</p>
//               <div className="flex flex-wrap gap-2">
//                 {listingDetails.listing_requirements
//                   .filter((req) => req.requirement_type === "required")
//                   .map((req, idx) => (
//                     <span
//                       key={idx}
//                       className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
//                     >
//                       {req.skills.name}
//                     </span>
//                   ))}
//               </div>
//             </div>

//             <div>
//               <p className="text-xs text-gray-500 font-medium mb-2">
//                 Nice to have
//               </p>
//               <div className="flex flex-wrap gap-2">
//                 {listingDetails.listing_requirements
//                   .filter((req) => req.requirement_type === "nice_to_have")
//                   .map((req, idx) => (
//                     <span
//                       key={idx}
//                       className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
//                     >
//                       {req.skills.name}
//                     </span>
//                   ))}
//               </div>
//             </div>
//           </div>

//           {/* Missing Skills Section */}
//           {missingSkills.length > 0 ? (
//             <div className="pt-4 border-t border-gray-100 space-y-3">
//               <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
//                 <span>🎯</span>
//                 <span>Skills you're missing</span>
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {missingSkills.map((req, idx) => (
//                   <span
//                     key={idx}
//                     className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
//                   >
//                     {req.skills.name}
//                   </span>
//                 ))}
//               </div>

//               <p className="text-xs text-gray-400">
//                 Add these to your{" "}
//                 <Link to="/profile" className="text-gray-600 underline">
//                   skills profile
//                 </Link>{" "}
//                 to improve your score.
//               </p>
//             </div>
//           ) : (
//             <p className="text-xs text-gray-400">
//               You have all the required skills for this role!
//             </p>
//           )}
//         </div>

//         {/* Application CTA Card */}
//         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm  space-y-4">
//           <div>
//             <p className="text-xs text-gray-400 mb-1">Application deadline</p>
//             <p className="text-sm font-bold text-gray-900">
//               {formatDateWithOrdinal(listingDetails.deadline)}
//             </p>
//           </div>
//           <button
//             className="w-full bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold py-3 rounded-xl transition-colors"
//             onClick={manageApply}
//           >
//             Log in to apply
//           </button>

//           <p className="text-xs text-gray-400 text-center">
//             Don't have an account?{" "}
//             <Link to="/signup" className="text-gray-600 hover:underline">
//               Sign up free
//             </Link>
//           </p>
//         </div>

//         {/* Posted By Card */}
//         <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
//           <div className="w-10 h-10 bg-[#064E3B] text-white font-bold text-base rounded-xl flex items-center justify-center flex-shrink-0">
//             M
//           </div>
//           <div>
//             <p className="text-xs text-gray-400">Posted by</p>
//             <p className="text-sm font-bold text-gray-900">
//               {listingDetails.organizations.name}
//             </p>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

import React from "react";
import { Link } from "react-router-dom";
import { useListingDetails } from "../../hooks/useListingDetails";
import { formatDateWithOrdinal } from "../../hooks/useListingDetails";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const ListingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listingDetails, matchScore, missingSkills, applicantSkills } =
    useListingDetails();

  const manageApply = () => {
    // 1. If user is not logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }
    // 2. If user has no skills, prompt and redirect to profile setup
    if (!applicantSkills || applicantSkills.length === 0) {
      alert(
        "Please fill your profile and select at least one skill before applying.",
      );
      navigate("/skill-profile");
      return;
    }
    // 3. Proceed to application form page
    navigate(`/apply-listing/${listingDetails?.id}`);
  };

  const applicantCount = listingDetails?.applications?.[0]?.count ?? 0;

  if (!listingDetails) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-8 flex justify-center items-center">
        <p className="text-gray-500">Loading listing details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] pb-12 font-sans">
      {/* Top Navigation / Header space */}
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <Link
          to="/browse"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <span className="mr-2">&larr;</span> Back to listings
        </Link>
      </div>

      <main className="max-w-4xl mx-auto px-4 space-y-6">
        {/* Main Listing Information Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            {/* Organization / Company Logo Avatar */}
            <div className="w-12 h-12 bg-[#064E3B] text-white font-bold text-xl rounded-xl flex items-center justify-center flex-shrink-0">
              {listingDetails.title ? listingDetails.title.charAt(0) : "M"}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="capitalize bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {listingDetails.type}
                </span>
                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span>★</span> Skills Match Score: {matchScore}%
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 pt-1">
                {listingDetails.title}
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                {listingDetails.organizations?.name}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 italic">
            Reflects required skills coverage only, not overall fit.{" "}
            <span className="font-semibold text-gray-600 not-italic">
              Apply regardless of your score.
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500 pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1.5">
              <span>📅</span>
              <span>
                Deadline: {formatDateWithOrdinal(listingDetails.deadline)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>👥</span>
              <span>Applicants: {applicantCount}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 space-y-3">
            <h2 className="text-base font-bold text-gray-900">
              About this role
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {listingDetails.description}
            </p>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-gray-900">Skills</h2>

          {/* Banner notification */}
          <div className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-100 space-y-1">
            <p className="text-xs font-semibold text-gray-700">
              Required skills not on your profile: Node.js, PostgreSQL, Redis
            </p>
            <p className="text-xs text-gray-500">
              Skills Match Score:{" "}
              <span className="font-semibold">{matchScore}%</span>
            </p>
            <p className="text-[11px] text-gray-400 italic">
              Reflects required skills coverage only, not overall fit.{" "}
              <span className="font-semibold text-gray-600 not-italic">
                Apply regardless of your score.
              </span>
            </p>
          </div>

          {/* Skill Groups */}
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Required</p>
              <div className="flex flex-wrap gap-2">
                {listingDetails.listing_requirements
                  .filter((req) => req.requirement_type === "required")
                  .map((req, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
                    >
                      {req.skills.name}
                    </span>
                  ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">
                Nice to have
              </p>
              <div className="flex flex-wrap gap-2">
                {listingDetails.listing_requirements
                  .filter((req) => req.requirement_type === "nice_to_have")
                  .map((req, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
                    >
                      {req.skills.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Missing Skills Section */}
          {missingSkills.length > 0 ? (
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                <span>🎯</span>
                <span>Skills you're missing</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((req, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium"
                  >
                    {req.skills.name}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-400">
                Add these to your{" "}
                <Link to="/skill-profile" className="text-gray-600 underline">
                  skills profile
                </Link>{" "}
                to improve your score.
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-400">
              You have all the required skills for this role!
            </p>
          )}
        </div>

        {/* Application CTA Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Application deadline</p>
            <p className="text-sm font-bold text-gray-900">
              {formatDateWithOrdinal(listingDetails.deadline)}
            </p>
          </div>
          {/* I need to check if deadline has passed */}
          {new Date(listingDetails.deadline) < new Date() ? (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 text-center font-semibold py-3 rounded-xl text-sm">
              This listing is closed (Deadline passed)
            </div>
          ) : (
            <>
              <button
                className={`w-full bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold py-3 rounded-xl transition-colors ${!applicantSkills || (applicantSkills.length === 0 && "bg-gray-500 hover:bg-gray-500")}`}
                onClick={manageApply}
                disabled={
                  !user || !applicantSkills || applicantSkills.length === 0
                }
              >
                {!user
                  ? "Login to apply"
                  : !applicantSkills || applicantSkills.length === 0
                    ? "Complete Skill Profile to Apply"
                    : "Apply"}
              </button>

              {!user && (
                <p className="text-xs text-gray-400 text-center">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-gray-600 hover:underline">
                    Sign up free
                  </Link>
                </p>
              )}
            </>
          )}
        </div>

        {/* Posted By Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 bg-[#064E3B] text-white font-bold text-base rounded-xl flex items-center justify-center flex-shrink-0">
            M
          </div>
          <div>
            <p className="text-xs text-gray-400">Posted by</p>
            <p className="text-sm font-bold text-gray-900">
              {listingDetails.organizations.name}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
