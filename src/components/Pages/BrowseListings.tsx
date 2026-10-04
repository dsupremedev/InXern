import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

interface BrowserListingsProps {
  id: string;
  title: string;
  type: "job" | "internship";
  deadline: string;
  organizations: {
    name: string;
  };
  listings_requirements: {
    skill_id: string;
    requirement_type: "required" | "nice-to-have";
  }[];
  matchScore?: number;
}

export const BrowseListings: React.FC = () => {
  const [listings, setListings] = useState<BrowserListingsProps[]>([]);
  const [applicantSkillIds, setApplicantSkillIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<"all" | "job" | "internship">(
    "all",
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // I need to query supabase DB for the applicant skills if logged in

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let userSkillIds: string[] = [];
        if (user) {
          const { data: userSkills, error: userSkillsError } = await supabase
            .from("applicant_skills")
            .select("skill_id")
            .eq("applicant_id", user.id);
          if (userSkillsError) {
            throw userSkillsError;
          }

          //   I neeed to get the ids of the user skill in a state
          userSkillIds = userSkills ? userSkills.map((s) => s.skill_id) : [];

          // the ids of the user skills now goes into the setApplicantSkills
          setApplicantSkillIds(userSkillIds);
        }

        //   I need to fetch the listings, organization and requirements details from supabase DB
        const { data: listingsData, error: listingsError } = await supabase
          .from("listings")
          .select(
            `id, title, type, deadline, organizations(name), listing_requirements(skill_id, requirement_type)`,
          )
          .eq("status", "published");

        console.log("Supabase Listings Data:", listingsData);
        console.log("Supabase Listings Error:", listingsError);

        if (listingsError) {
          throw listingsError;
        }

        const formattedListings = (listingsData || []).map((item: any) => {
          const requirements = item.listing_requirements;
          const requiredSkills = requirements.filter(
            (r: any) => r.requirement_type === "required",
          );

          let score = 0;
          if (requiredSkills.length > 0 && userSkillIds.length > 0) {
            const matched = requiredSkills.filter((r: any) =>
              userSkillIds.includes(r.skill_id),
            );
            score = Math.round((matched.length / requiredSkills.length) * 100);
          }

          return {
            ...item,
            matchScore: score,
          };
        });

        setListings(formattedListings);

        //   I need to compute the match score for each listing
      } catch (error: any) {
        console.error("Failed to load fetch listing", error);
        setError("Failed to fech listings, please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Filter listings based on active tab
  const filteredListings = listings.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  return (
    <div className="min-h-screen bg-[#F7F7F5] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              Browse Opportunities
            </h1>
            <p className="text-sm text-[#5C5C5C] mt-1">
              Find internships and jobs matching your technical skills.
            </p>
          </div>

          {/* Complete Profile Nudge if user has no skills */}
          {user && applicantSkillIds.length === 0 && (
            <button
              onClick={() => navigate("/skill-profile")}
              className="mt-4 sm:mt-0 text-xs font-semibold bg-[#C9A227] text-[#1A1A1A] px-4 py-2 rounded-lg hover:bg-[#E0B93A] shadow-sm transition-all"
            >
              + Build Skills Profile to see Match Score
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#E0E0E0] pb-3">
          {(["all", "job", "internship"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterType === tab
                  ? "bg-[#0F4C4C] text-white"
                  : "bg-white text-[#5C5C5C] border border-[#E0E0E0] hover:border-[#0F4C4C]"
              }`}
            >
              {tab === "all" ? "All Listings" : `${tab}s`}
            </button>
          ))}
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-12 text-[#5C5C5C] text-sm">
            Loading active opportunities...
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Listings List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredListings.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-[#E0E0E0] text-center text-[#5C5C5C] text-sm">
                No listings found for this filter.
              </div>
            ) : (
              filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl border border-[#E0E0E0] p-6 shadow-sm hover:border-[#0F4C4C] transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          listing.type === "internship"
                            ? "bg-[#E6F0E6] text-[#0F4C4C]"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {listing.type}
                      </span>
                      <span className="text-xs text-[#5C5C5C]">
                        {listing.organizations?.name || "Verified Organization"}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-[#1A1A1A]">
                      {listing.title}
                    </h2>

                    <p className="text-xs text-[#5C5C5C]">
                      Deadline:{" "}
                      {new Date(listing.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Match Score Badge & Action */}
                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    {user && applicantSkillIds.length > 0 ? (
                      <div className="flex items-center gap-1 bg-[#E6F0E6] border border-[#0F4C4C]/20 px-3 py-1.5 rounded-lg">
                        <span className="text-xs font-bold text-[#0F4C4C]">
                          {listing.matchScore}% Match
                        </span>
                      </div>
                    ) : null}

                    <Link
                      to={`/listing-detail/${listing.id}`}
                      className="bg-[#0F4C4C] hover:bg-[#1A6363] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors"
                    >
                      View Details & Apply
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
