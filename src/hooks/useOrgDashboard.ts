import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export interface ApplicantSubmission {
  id: string;
  applicant_id: string;
  match_score: number;
  status: string;
  applied_at: string;
  resume_link: string;
  message: string | null;
  declared_skills_snapshot?: string[];
  applicant_profile?: {
    full_name: string;
  };
  //   skills?: {
  //     skill_name: string;
  //     proficiency: string;
  //   }[];
}

export interface OrgListingWithApplicants {
  id: string;
  title: string;
  description: string;
  type: string;
  deadline: string;
  status: string;
  applications: ApplicantSubmission[];
}

export const useOrgDashboard = () => {
  const [listings, setListings] = useState<OrgListingWithApplicants[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  const fetchDashboardData = async () => {
    if (!profile?.organization_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch listings belonging to this organization
      const { data: listingsData, error: listingsError } = await supabase
        .from("listings")
        .select("*")
        .eq("org_id", profile.organization_id)
        .order("created_at", { ascending: false });

      if (listingsError) throw listingsError;

      if (!listingsData || listingsData.length === 0) {
        setListings([]);
        setLoading(false);
        return;
      }

      // 2. For each listing, fetch its applications and applicant profiles
      const listingIds = listingsData.map((l) => l.id);

      const { data: appsData, error: appsError } = await supabase
        .from("applications")
        .select(
          `
          id,
          applicant_id,
          match_score,
          status,
          applied_at,
          resume_link,
          message,
          listing_id,
          declared_skills_snapshot,
          profiles:applicant_id (
            full_name
          )
        `,
        )
        .in("listing_id", listingIds)
        .order("match_score", { ascending: false });

      if (appsError) throw appsError;

      // 3. Map applications to their respective listings
      const combined: OrgListingWithApplicants[] = listingsData.map(
        (listing) => {
          const listingApps = (appsData || [])
            .filter((app: any) => app.listing_id === listing.id)
            .map((app: any) => ({
              id: app.id,
              applicant_id: app.applicant_id,
              match_score: app.match_score,
              status: app.status,
              applied_at: app.applied_at,
              resume_link: app.resume_link,
              message: app.message,
              declared_skills_snapshot: app.declared_skills_snapshot || [],
              applicant_profile: {
                full_name: app.profiles?.full_name || "Applicant",
              },
            }));

          return {
            ...listing,
            applications: listingApps,
          };
        },
      );

      setListings(combined);
    } catch (err: any) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [profile?.organization_id]);

  const updateApplicationStatus = async (
    appId: string,
    newStatus:
      | "Applied"
      | "Under Review"
      | "Shortlisted"
      | "Hired"
      | "Rejected"
      | "Withdrawn",
  ) => {
    try {
      setError(null);

      // Call the secure Postgres function (bypasses recursive RLS bottlenecks)
      const { error: rpcError } = await supabase.rpc(
        "update_application_status_secure" as any,
        {
          app_id: appId,
          new_status: newStatus,
        },
      );

      if (rpcError) throw rpcError;

      // Refresh local state
      setListings((prevListings) =>
        prevListings.map((listing) => ({
          ...listing,
          applications: listing.applications.map((app) =>
            app.id === appId ? { ...app, status: newStatus } : app,
          ),
        })),
      );
    } catch (err: any) {
      console.error("Failed to update status:", err);
      setError(err.message || "Failed to update application status.");
    }
  };

  // Make sure to return updateApplicationStatus in your return object:
  return {
    listings,
    loading,
    error,
    refresh: fetchDashboardData,
    updateApplicationStatus,
  };

  return {
    listings,
    loading,
    error,
    refresh: fetchDashboardData,
  };
};
