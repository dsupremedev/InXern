import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import type { skills } from "../components/SkillProfile";

export interface Skills {
  id: string;
  name: string;
}

export interface organizationDetails {
  id: string;
  name: string;
}

export interface Listingrequirements {
  skill_id: string;
  requirement_type: "nice_to_have" | "required";
  skills: Skills;
}
export interface ListingDetailsData {
  id: string;
  title: string;
  type: "job" | "internship";
  deadline: string;
  description: string;
  applications: { count: number }[];
  organizations: organizationDetails;
  listing_requirements: Listingrequirements[];
}

export const formatDateWithOrdinal = (dateString?: string): string => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString; // Fallback if invalid date

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  // Determine ordinal suffix (st, nd, rd, th)
  const getOrdinalSuffix = (d: number) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} of ${month} ${year}`;
};

export const useListingDetails = () => {
  const { user } = useAuth();
  const [applicantSkills, setApplicantSkills] = useState<string[] | null>([]);
  const [listingDetails, setListingDetails] =
    useState<ListingDetailsData | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    try {
      // I need to fetch the logged in applicant skills
      const fetchApplicantSkillsIds = async () => {
        if (!user?.id) return;
        const { data: applicantsData, error: applicantsError } = await supabase
          .from("applicant_skills")
          .select("skill_id")
          .eq("applicant_id", user?.id);

        if (applicantsData) {
          const skillId = applicantsData.map((item) => item.skill_id);
          setApplicantSkills(skillId);
        } else {
          setApplicantSkills(null);
        }
      };

      //   I need to fetch listings data
      const fetchListings = async () => {
        if (!id) return;
        const { data: listingData, error: listingError } = await supabase
          .from("listings")
          .select(
            `id, title, type, deadline, description , applications(count), organizations( id, name), listing_requirements(
            skill_id, requirement_type, skills(id, name))`,
          )
          .eq("id", id)
          .single();

        if (listingError) {
          console.error("Listing query error", listingError);
          return;
        }
        setListingDetails(listingData);
      };

      fetchApplicantSkillsIds();
      fetchListings();
    } catch (error: any) {
      console.error("failed to fetch", error);
    }
  }, [user, id]);

  const matchScore = useMemo(() => {
    if (!listingDetails || listingDetails.listing_requirements.length === 0) {
      return 0;
    }

    const requirements = listingDetails.listing_requirements;
    let totalWeight = 0;
    let earnedWeight = 0;

    requirements.forEach((req) => {
      const weight = req.requirement_type === "required" ? 2 : 1;
      totalWeight += weight;

      if (applicantSkills?.includes(req.skill_id)) {
        earnedWeight += weight;
      }
    });

    return Math.round((earnedWeight / totalWeight) * 100);
  }, [applicantSkills, listingDetails]);

  const missingSkills =
    listingDetails?.listing_requirements?.filter(
      (req) =>
        req.requirement_type === "required" &&
        !applicantSkills?.includes(req.skill_id),
    ) || [];
  console.log("Missing skills:", missingSkills.length);
  console.log("Applicant skills:", applicantSkills);
  console.log("Listing Details:", listingDetails);

  return {
    listingDetails,
    applicantSkills,
    matchScore,
    missingSkills,
  };
};
