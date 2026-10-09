// import { useState, useEffect } from "react";
// import { supabase } from "../lib/supabase"; // Adjust path to your supabase client if needed

// export interface ApplicationItem {
//   id: string;
//   listing_id: string;
//   resume_link: string;
//   message: string | null;
//   status:
//     | "Applied"
//     | "Under Review"
//     | "Shortlisted"
//     | "Hired"
//     | "Rejected"
//     | "Withdrawn";
//   match_score: number;
//   applied_at: string;
//   listing: {
//     title: string;
//     type: string;
//     deadline: string;
//     organizations: {
//       name: string;
//     };
//   };
//   history?: {
//     id: string;
//     status: string;
//     changed_at: string;
//   }[];
// }

// export const useApplications = () => {
//   const [applications, setApplications] = useState<ApplicationItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchApplications = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const { data: userData, error: userError } =
//         await supabase.auth.getUser();
//       if (userError || !userData.user) throw new Error("Not authenticated");

//       // Fetch applications along with listing details and organization name
//       const { data, error: fetchError } = await supabase
//         .from("applications")
//         .select(
//           `
//           id,
//           listing_id,
//           resume_link,
//           message,
//           status,
//           match_score,
//           applied_at,
//           listing:listings (
//             title,
//             type,
//             deadline,
//             organizations:organizations (
//               name
//             )
//           )
//         `,
//         )
//         .eq("applicant_id", userData.user.id)
//         .order("applied_at", { ascending: false });

//       if (fetchError) throw fetchError;
//       setApplications(data || []);
//     } catch (err: any) {
//       setError(err.message || "Failed to load applications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const withdrawApplication = async (applicationId: string) => {
//     try {
//       setError(null);
//       // Call Supabase update or RPC function for withdrawal
//       const { error: updateError } = await supabase
//         .from("applications")
//         .update({ status: "Withdrawn" })
//         .eq("id", applicationId);

//       if (updateError) throw updateError;

//       // Update local state to reflect withdrawal immediately
//       setApplications((prev) =>
//         prev.map((app) =>
//           app.id === applicationId ? { ...app, status: "Withdrawn" } : app,
//         ),
//       );
//       return { success: true };
//     } catch (err: any) {
//       setError(err.message || "Failed to withdraw application");
//       return { success: false, error: err.message };
//     }
//   };

//   useEffect(() => {
//     fetchApplications();
//   }, []);

//   return {
//     applications,
//     loading,
//     error,
//     refreshApplications: fetchApplications,
//     withdrawApplication,
//   };
// };

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase"; // Adjust path to your supabase client if needed

export interface ApplicationItem {
  id: string;
  listing_id: string;
  resume_link: string;
  message: string | null;
  status:
    | "Applied"
    | "Under Review"
    | "Shortlisted"
    | "Hired"
    | "Rejected"
    | "Withdrawn";
  match_score: number;
  applied_at: string;
  declared_skills_snapshot?: string[]; // <-- Added property for skills snapshot
  listing: {
    title: string;
    type: string;
    deadline: string;
    organizations: {
      name: string;
    };
  };
  history?: {
    id: string;
    status: string;
    changed_at: string;
  }[];
}

export const useApplications = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError || !userData.user) throw new Error("Not authenticated");

      // Fetch applications along with listing details, organization name, and declared_skills_snapshot
      const { data, error: fetchError } = await supabase
        .from("applications")
        .select(
          `
          id,
          listing_id,
          resume_link,
          message,
          status,
          match_score,
          applied_at,
          declared_skills_snapshot,
          listing:listings (
            title,
            type,
            deadline,
            organizations:organizations (
              name
            )
          )
        `,
        )
        .eq("applicant_id", userData.user.id)
        .order("applied_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Safely map data to ensure declared_skills_snapshot matches ApplicationItem type
      const formattedApplications: ApplicationItem[] = (data || []).map(
        (app: any) => ({
          ...app,
          declared_skills_snapshot: Array.isArray(app.declared_skills_snapshot)
            ? app.declared_skills_snapshot.map(String)
            : [],
        }),
      );

      setApplications(formattedApplications);
    } catch (err: any) {
      setError(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  // const withdrawApplication = async (applicationId: string) => {
  //   try {
  //     setError(null);
  //     // Call Supabase update or RPC function for withdrawal
  //     const { error: updateError } = await supabase
  //       .from("applications")
  //       .update({ status: "Withdrawn" })
  //       .eq("id", applicationId);

  //     if (updateError) throw updateError;

  //     // Update local state to reflect withdrawal immediately
  //     setApplications((prev) =>
  //       prev.map((app) =>
  //         app.id === applicationId ? { ...app, status: "Withdrawn" } : app,
  //       ),
  //     );
  //     return { success: true };
  //   } catch (err: any) {
  //     setError(err.message || "Failed to withdraw application");
  //     return { success: false, error: err.message };
  //   }
  // };

  const withdrawApplication = async (applicationId: string) => {
    try {
      setError(null);

      // Call the secure Postgres RPC function to avoid any RLS recursion
      const { error: rpcError } = await supabase.rpc(
        "withdraw_application_secure" as any,
        { app_id: applicationId },
      );

      if (rpcError) throw rpcError;

      // Update local state to reflect withdrawal immediately
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: "Withdrawn" } : app,
        ),
      );
      return { success: true };
    } catch (err: any) {
      setError(err.message || "Failed to withdraw application");
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    refreshApplications: fetchApplications,
    withdrawApplication,
  };
};
