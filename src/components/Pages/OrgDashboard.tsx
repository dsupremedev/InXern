// import React from "react";
// import { Link } from "react-router-dom";
// import { useOrgDashboard } from "../../hooks/useOrgDashboard";

// export const OrgDashboardPage = () => {
//   const { listings, loading, error, updateApplicationStatus } =
//     useOrgDashboard();

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] pb-12 font-sans">
//       {/* Header Space */}
//       <div className="max-w-5xl mx-auto px-4 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             Organization Dashboard
//           </h1>
//           <p className="text-sm text-gray-500 font-medium">
//             Manage your posted opportunities and review ranked candidate
//             applications.
//           </p>
//         </div>
//         <div>
//           <Link
//             to="/org/create-listing"
//             className="inline-block px-5 py-2.5 bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm rounded-xl transition-colors shadow-sm"
//           >
//             + Create New Listing
//           </Link>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="max-w-5xl mx-auto px-4 space-y-6">
//         {loading && (
//           <div className="text-center py-12 text-sm text-gray-500">
//             Loading your organization dashboard...
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
//             {error}
//           </div>
//         )}

//         {!loading && !error && listings.length === 0 && (
//           <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center space-y-4">
//             <p className="text-gray-600 font-medium text-sm">
//               You haven't posted any listings yet. Create your first one to
//               start receiving candidate applications!
//             </p>
//             <Link
//               to="/org/create-listing"
//               className="inline-block px-5 py-2.5 bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm rounded-xl transition-colors"
//             >
//               Create Listing
//             </Link>
//           </div>
//         )}

//         {!loading &&
//           listings.map((listing) => (
//             <div
//               key={listing.id}
//               className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 transition-all"
//             >
//               {/* Listing Header */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
//                 <div>
//                   <div className="flex items-center gap-2 mb-1">
//                     <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
//                       {listing.type}
//                     </span>
//                     <span
//                       className={`text-xs font-semibold px-2.5 py-0.5 rounded-md capitalize ${
//                         listing.status === "published"
//                           ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//                           : "bg-amber-50 text-amber-700 border border-amber-200"
//                       }`}
//                     >
//                       {listing.status}
//                     </span>
//                   </div>
//                   <h2 className="text-xl font-bold text-gray-900">
//                     {listing.title}
//                   </h2>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Deadline: {new Date(listing.deadline).toLocaleDateString()}
//                   </p>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Link
//                     to={`/org/edit-listing/${listing.id}`}
//                     className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition-colors"
//                   >
//                     Edit Listing
//                   </Link>
//                 </div>
//               </div>

//               {/* Applicants Section */}
//               <div className="space-y-3">
//                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
//                   Applications ({listing.applications.length})
//                 </h3>

//                 {listing.applications.length === 0 ? (
//                   <p className="text-xs text-gray-500 italic bg-gray-50 p-4 rounded-xl">
//                     No applications received for this listing yet.
//                   </p>
//                 ) : (
//                   <div className="space-y-4">
//                     {listing.applications.map((app) => (
//                       <div
//                         key={app.id}
//                         className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-200/70 space-y-4"
//                       >
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2">
//                               <h4 className="text-sm font-bold text-gray-900">
//                                 {app.applicant_profile?.full_name}
//                               </h4>
//                               <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
//                                 {app.status}
//                               </span>
//                             </div>
//                             {app.message && (
//                               <p className="text-xs text-gray-600 italic">
//                                 "{app.message}"
//                               </p>
//                             )}
//                             <p className="text-[11px] text-gray-400">
//                               Applied on:{" "}
//                               {new Date(app.applied_at).toLocaleDateString()}
//                             </p>
//                           </div>

//                           <div className="flex items-center gap-4 justify-between sm:justify-end">
//                             <div className="text-right">
//                               <span className="text-xs font-bold text-gray-900 block">
//                                 {app.match_score}% Match
//                               </span>
//                             </div>
//                             <a
//                               href={app.resume_link}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="px-3 py-1.5 bg-[#0F4C4C] hover:bg-[#1A6363] text-white text-xs font-medium rounded-lg transition-colors"
//                             >
//                               View Resume &rarr;
//                             </a>
//                           </div>
//                         </div>

//                         {/* Status Pipeline Action Buttons */}
//                         <div className="pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-2">
//                           <span className="text-xs font-semibold text-gray-500 mr-1">
//                             Update Status:
//                           </span>
//                           {(
//                             [
//                               "Applied",
//                               "Under Review",
//                               "Shortlisted",
//                               "Hired",
//                               "Rejected",
//                             ] as const
//                           ).map((pipelineStatus) => {
//                             const isActive = app.status === pipelineStatus;
//                             return (
//                               <button
//                                 key={pipelineStatus}
//                                 type="button"
//                                 onClick={() =>
//                                   updateApplicationStatus?.(
//                                     app.id,
//                                     pipelineStatus,
//                                   )
//                                 }
//                                 className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
//                                   isActive
//                                     ? "bg-[#0F4C4C] text-white border-[#0F4C4C] shadow-sm"
//                                     : "bg-white text-gray-700 border-gray-200 hover:border-[#0F4C4C]"
//                                 }`}
//                               >
//                                 {pipelineStatus}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//       </main>
//     </div>
//   );
// };

import React from "react";
import { Link } from "react-router-dom";
import { useOrgDashboard } from "../../hooks/useOrgDashboard";

export const OrgDashboardPage = () => {
  const { listings, loading, error, updateApplicationStatus } =
    useOrgDashboard();

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1E293B] pb-12 font-sans">
      {/* Header Space */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Organization Dashboard
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Manage your posted opportunities and review ranked candidate
            applications.
          </p>
        </div>
        <div>
          <Link
            to="/org/create-listing"
            className="inline-block px-5 py-2.5 bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm rounded-xl transition-colors shadow-sm"
          >
            + Create New Listing
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 space-y-6">
        {loading && (
          <div className="text-center py-12 text-sm text-gray-500">
            Loading your organization dashboard...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && listings.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center space-y-4">
            <p className="text-gray-600 font-medium text-sm">
              You haven't posted any listings yet. Create your first one to
              start receiving candidate applications!
            </p>
            <Link
              to="/org/create-listing"
              className="inline-block px-5 py-2.5 bg-[#D9A726] hover:bg-[#c49520] text-gray-900 font-semibold text-sm rounded-xl transition-colors"
            >
              Create Listing
            </Link>
          </div>
        )}

        {!loading &&
          listings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6 transition-all"
            >
              {/* Listing Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {listing.type}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-md capitalize ${
                        listing.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {listing.title}
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Deadline: {new Date(listing.deadline).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/org/edit-listing/${listing.id}`}
                    className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl transition-colors"
                  >
                    Edit Listing
                  </Link>
                </div>
              </div>

              {/* Applicants Section */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Applications ({listing.applications.length})
                </h3>

                {listing.applications.length === 0 ? (
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-4 rounded-xl">
                    No applications received for this listing yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {listing.applications.map((app: any) => (
                      <div
                        key={app.id}
                        className="bg-[#F8F9FA] rounded-xl p-4 border border-gray-200/70 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-gray-900">
                                {app.applicant_profile?.full_name}
                              </h4>
                              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                                {app.status}
                              </span>
                            </div>
                            {app.message && (
                              <p className="text-xs text-gray-600 italic">
                                "{app.message}"
                              </p>
                            )}
                            <p className="text-[11px] text-gray-400">
                              Applied on:{" "}
                              {new Date(app.applied_at).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 justify-between sm:justify-end">
                            <div className="text-right">
                              <span className="text-xs font-bold text-gray-900 block">
                                {app.match_score}% Match
                              </span>
                            </div>
                            <a
                              href={app.resume_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-[#0F4C4C] hover:bg-[#1A6363] text-white text-xs font-medium rounded-lg transition-colors"
                            >
                              View Resume &rarr;
                            </a>
                          </div>
                        </div>

                        {/* Skills Snapshot at Time of Application */}
                        {/* <div className="pt-3 border-t border-gray-200/60 space-y-1.5">
                          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Skills Snapshot at Application:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {app.declared_skills_snapshot &&
                            app.declared_skills_snapshot.length > 0 ? (
                              app.declared_skills_snapshot.map(
                                (skillName: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-0.5 rounded-md font-medium shadow-2xs"
                                  >
                                    {skillName}
                                  </span>
                                ),
                              )
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                No skill snapshot recorded
                              </span>
                            )}
                          </div>
                        </div> */}
                        {/* Skills Snapshot at Time of Application */}
                        <div className="pt-3 border-t border-gray-200/60 space-y-1.5">
                          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                            Skills Snapshot at Application:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {app.declared_skills_snapshot &&
                            app.declared_skills_snapshot.length > 0 ? (
                              app.declared_skills_snapshot.map(
                                (skillItem: any, idx: number) => {
                                  // Handle whether the snapshot item is stored as a string or an object
                                  const skillName =
                                    typeof skillItem === "string"
                                      ? skillItem
                                      : skillItem?.skill_name ||
                                        skillItem?.name ||
                                        JSON.stringify(skillItem);

                                  return (
                                    <span
                                      key={idx}
                                      className="bg-white border border-gray-200 text-gray-700 text-xs px-2.5 py-0.5 rounded-md font-medium shadow-2xs"
                                    >
                                      {skillName}
                                    </span>
                                  );
                                },
                              )
                            ) : (
                              <span className="text-xs text-gray-400 italic">
                                No skill snapshot recorded
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Pipeline Action Buttons */}
                        <div className="pt-3 border-t border-gray-200/60 flex flex-wrap items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500 mr-1">
                            Update Status:
                          </span>
                          {(
                            [
                              "Applied",
                              "Under Review",
                              "Shortlisted",
                              "Hired",
                              "Rejected",
                            ] as const
                          ).map((pipelineStatus) => {
                            const isActive = app.status === pipelineStatus;
                            return (
                              <button
                                key={pipelineStatus}
                                type="button"
                                onClick={() =>
                                  updateApplicationStatus?.(
                                    app.id,
                                    pipelineStatus,
                                  )
                                }
                                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                                  isActive
                                    ? "bg-[#0F4C4C] text-white border-[#0F4C4C] shadow-sm"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#0F4C4C]"
                                }`}
                              >
                                {pipelineStatus}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </main>
    </div>
  );
};
