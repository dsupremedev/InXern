// import React, { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabase";

// export const AdminDashboardPage = () => {
//   const [orgs, setOrgs] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchOrgs = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from("organizations")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (!error && data) {
//       setOrgs(data);
//     } else {
//       setError("Failed to fetch organizations.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchOrgs();
//   }, []);

//   const handleUpdateOrgStatus = async (
//     orgId: string,
//     newStatus: "approved" | "rejected" | "pending",
//   ) => {
//     setError(null);
//     const { error: rpcError } = await supabase.rpc(
//       "update_organization_status_secure" as any,
//       {
//         org_id: orgId,
//         new_status: newStatus,
//       },
//     );

//     if (!rpcError) {
//       setOrgs(
//         orgs.map((o) => (o.id === orgId ? { ...o, status: newStatus } : o)),
//       );
//     } else {
//       setError(rpcError.message || "Failed to update organization status.");
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">
//           Manage Organizations
//         </h1>
//         <p className="text-sm text-gray-500 font-medium">
//           Review registered organizations and approve or reject their access to
//           post listings.
//         </p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm leading-relaxed">
//           {error}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center py-12 text-sm text-gray-500">
//           Loading organizations...
//         </div>
//       ) : (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase text-gray-400 tracking-wider">
//                   <th className="p-4">Organization Name</th>
//                   <th className="p-4">Website</th>
//                   <th className="p-4">Status</th>
//                   <th className="p-4 text-right">Approval Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100 text-sm">
//                 {orgs.map((org) => (
//                   <tr
//                     key={org.id}
//                     className="hover:bg-gray-50/50 transition-colors"
//                   >
//                     <td className="p-4 font-semibold text-gray-900">
//                       {org.name}
//                     </td>
//                     <td className="p-4 text-gray-500">
//                       {org.website ? (
//                         <a
//                           href={org.website}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="text-emerald-600 hover:underline"
//                         >
//                           {org.website}
//                         </a>
//                       ) : (
//                         "N/A"
//                       )}
//                     </td>
//                     <td className="p-4">
//                       <span
//                         className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md uppercase tracking-wide ${
//                           org.status === "approved"
//                             ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
//                             : org.status === "rejected"
//                               ? "bg-red-50 text-red-700 border border-red-200"
//                               : "bg-amber-50 text-amber-700 border border-amber-200"
//                         }`}
//                       >
//                         {org.status || "pending"}
//                       </span>
//                     </td>
//                     <td className="p-4 text-right space-x-2">
//                       {org.status !== "approved" && (
//                         <button
//                           onClick={() =>
//                             handleUpdateOrgStatus(org.id, "approved")
//                           }
//                           className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
//                         >
//                           Approve
//                         </button>
//                       )}
//                       {org.status !== "rejected" && (
//                         <button
//                           onClick={() =>
//                             handleUpdateOrgStatus(org.id, "rejected")
//                           }
//                           className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
//                         >
//                           Reject
//                         </button>
//                       )}
//                       {org.status === "approved" && (
//                         <button
//                           onClick={() =>
//                             handleUpdateOrgStatus(org.id, "pending")
//                           }
//                           className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
//                         >
//                           Revoke / Set Pending
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export const AdminDashboardPage = () => {
  const [orgs, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchOrgs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrgs(data);
    } else {
      setError("Failed to fetch organizations.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleUpdateOrgStatus = async (
    orgId: string,
    newStatus: "approved" | "rejected" | "pending",
  ) => {
    setError(null);
    const { error: rpcError } = await supabase.rpc(
      "update_organization_status_secure" as any,
      {
        org_id: orgId,
        new_status: newStatus,
      },
    );

    if (!rpcError) {
      setOrgs(
        orgs.map((o) => (o.id === orgId ? { ...o, status: newStatus } : o)),
      );
    } else {
      setError(rpcError.message || "Failed to update organization status.");
    }
  };

  // --- Metrics Calculations ---
  const totalOrgs = orgs.length;
  const approvedOrgs = orgs.filter((o) => o.status === "approved").length;
  const pendingOrgs = orgs.filter(
    (o) => !o.status || o.status === "pending",
  ).length;
  const rejectedOrgs = orgs.filter((o) => o.status === "rejected").length;

  const filteredOrgs = orgs.filter((org) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "pending")
      return !org.status || org.status === "pending";
    return org.status === filterStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Platform Overview & Organizations
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          Monitor platform employers, review verification requests, and manage
          access control.
        </p>
      </div>

      {/* --- OVERVIEW METRICS DECK --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Total Organizations
          </span>
          <p className="text-3xl font-bold text-gray-900">{totalOrgs}</p>
          <p className="text-xs text-gray-500">Registered platform employers</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Pending Approvals
          </span>
          <p className="text-3xl font-bold text-amber-600">{pendingOrgs}</p>
          <p className="text-xs text-gray-500">Awaiting security & review</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Approved Employers
          </span>
          <p className="text-3xl font-bold text-emerald-600">{approvedOrgs}</p>
          <p className="text-xs text-gray-500">Active and posting listings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">
            Rejected Accounts
          </span>
          <p className="text-3xl font-bold text-red-600">{rejectedOrgs}</p>
          <p className="text-xs text-gray-500">Access denied or suspended</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm leading-relaxed">
          {error}
        </div>
      )}

      {/* --- ORGANIZATIONS TABLE SECTION --- */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
        {/* Table Header / Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">
            Registered Organizations
          </h2>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">
              Filter Status:
            </span>
            {(["all", "pending", "approved", "rejected"] as const).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                    filterStatus === status
                      ? "bg-[#0F4C4C] text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ),
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-sm text-gray-500">
            Loading organizations...
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 italic">
            No organizations found for the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase text-gray-400 tracking-wider">
                  <th className="p-4">Organization Name</th>
                  <th className="p-4">Website</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrgs.map((org) => (
                  <tr
                    key={org.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 font-semibold text-gray-900">
                      {org.name}
                    </td>
                    <td className="p-4 text-gray-500">
                      {org.website ? (
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:underline"
                        >
                          {org.website}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md uppercase tracking-wide ${
                          org.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : org.status === "rejected"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {org.status || "pending"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {org.status !== "approved" && (
                        <button
                          onClick={() =>
                            handleUpdateOrgStatus(org.id, "approved")
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {org.status !== "rejected" && (
                        <button
                          onClick={() =>
                            handleUpdateOrgStatus(org.id, "rejected")
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                      )}
                      {org.status === "approved" && (
                        <button
                          onClick={() =>
                            handleUpdateOrgStatus(org.id, "pending")
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          Revoke / Set Pending
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
