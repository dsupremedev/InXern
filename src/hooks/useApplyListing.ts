// import { useEffect } from "react";
// import { supabase } from "../lib/supabase";
// import { useParams } from "react-router-dom";
// import { useState } from "react";

// export interface organizationProps {
//   name: string;
// }

// export interface applyListingProps {
//   id: string;
//   title: string;
//   organizations: organizationProps;
// }

// export const useApplyListing = () => {
//   const { id } = useParams<{ id: string }>();
//   const [listedData, setListedData] = useState<applyListingProps | null>(null);
//   const [resumeLink, setResumeLink] = useState("");
//   const [message, setMessage] = useState("");
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   useEffect(() => {
//     if (!id) return;

//     const fetchListingData = async () => {
//       try {
//         const { data, error } = await supabase
//           .from("listings")
//           .select("id, title, organizations( name )")
//           .eq("id", id)
//           .single();

//         if (data) {
//           setListedData(data);
//         }
//       } catch (error) {}
//     };
//     fetchListingData();
//   }, [id]);

//   const manageSubmitForm = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!listedData?.id) return;

//     setIsSubmitted(true);
//     setFeedback("");

//     try {
//       const { data: submissonData, error: submissionError } =
//         await supabase.rpc("create_application", {
//           p_listing_id: listedData.id,
//           p_resume_link: resumeLink,
//           p_message: message,
//         });

//       if (submissionError) throw submissionError;
//     } catch (error: any) {
//       console.error("Submission error", error);
//       setFeedback(error.message || "Failed to submit application");
//     } finally {
//       setIsSubmitted(false);
//     }
//   };

//   console.log("Result is", listedData);

//   return {
//     listedData,
//     resumeLink,
//     setResumeLink,
//     message,
//     setMessage,
//     feedback,
//     setFeedback,
//     isSubmitted,
//     setIsSubmitted,
//     manageSubmitForm,
//   };
// };

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";
// import { useAuth } from "../context/AuthContext";

// export const useApplyListing = () => {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [listedData, setListedData] = useState<any>(null);
//   const [resumeLink, setResumeLink] = useState("");
//   const [message, setMessage] = useState("");
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Fetch listing details for header/context
//   useEffect(() => {
//     const fetchListing = async () => {
//       if (!id) return;
//       const { data, error } = await supabase
//         .from("listings")
//         .select(`
//           id,
//           title,
//           type,
//           organizations (
//             name
//           )
//         `)
//         .eq("id", id)
//         .single();

//       if (!error && data) {
//         setListedData(data);
//       }
//     };
//     fetchListing();
//   }, [id]);

//   const manageSubmitForm = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user || !id) {
//       setFeedback("You must be logged in to apply.");
//       return;
//     }

//     try {
//       setIsSubmitted(true);
//       setFeedback(null);

//       // 1. Fetch applicant's current skills to create the snapshot
//       const { data: userSkillsData, error: skillsError } = await supabase
//         .from("applicant_skills")
//         .select(`
//           skills (
//             name
//           )
//         `)
//         .eq("applicant_id", user.id);

//       if (skillsError) throw skillsError;

//       // Extract skill names into an array
//       const skillNamesSnapshot = userSkillsData
//         ?.map((item: any) => item.skills?.name)
//         .filter(Boolean) || [];

//       // 2. Insert application with declared_skills_snapshot included
//       const { error: insertError } = await supabase
//         .from("applications")
//         .insert({
//           listing_id: id,
//           applicant_id: user.id,
//           resume_link: resumeLink,
//           message: message,
//           declared_skills_snapshot: skillNamesSnapshot, // <-- Captures snapshot here!
//         });

//       if (insertError) {
//         if (insertError.code === "23505") {
//           // Unique constraint violation (already applied)
//           setFeedback("You have already applied to this listing.");
//         } else {
//           throw insertError;
//         }
//       } else {
//         setFeedback("Your application has been successfully submitted!");
//       }
//     } catch (err: any) {
//       console.error("Submission error:", err);
//       setFeedback(err.message || "Failed to submit application. Please try again.");
//     } finally {
//       setIsSubmitted(false);
//     }
//   };

//   return {
//     listedData,
//     resumeLink,
//     setResumeLink,
//     message,
//     setMessage,
//     feedback,
//     setFeedback,
//     isSubmitted,
//     setIsSubmitted,
//     manageSubmitForm,
//   };
// };

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export const useApplyListing = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [listedData, setListedData] = useState<any>(null);
  const [resumeLink, setResumeLink] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch listing details and requirements for match calculation
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from("listings")
        .select(
          `
          id,
          title,
          type,
          organizations (
            name
          ),
          listing_requirements (
            skill_id,
            requirement_type
          )
        `,
        )
        .eq("id", id)
        .single();

      if (!error && data) {
        setListedData(data);
      }
    };
    fetchListing();
  }, [id]);

  const manageSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) {
      setFeedback("You must be logged in to apply.");
      return;
    }

    if (listedData?.deadline && new Date(listedData.deadline) < new Date()) {
      setFeedback(
        "Sorry, this listing has expired and is no longer accepting applications.",
      );
      setIsSubmitted(false);
      return;
    }

    try {
      setIsSubmitted(true);
      setFeedback(null);

      // 1. Fetch applicant's current skills to calculate score and build snapshot
      const { data: userSkillsData, error: skillsError } = await supabase
        .from("applicant_skills")
        .select(
          `
          skill_id,
          skills (
            name
          )
        `,
        )
        .eq("applicant_id", user.id);

      if (skillsError) throw skillsError;

      // Extract skill names for snapshot
      const skillNamesSnapshot =
        userSkillsData?.map((item: any) => item.skills?.name).filter(Boolean) ||
        [];

      // 2. Compute accurate match score based on required skills
      const requiredRequirements =
        listedData?.listing_requirements?.filter(
          (req: any) => req.requirement_type === "required",
        ) || [];

      let calculatedMatchScore = 100; // Default if no required skills specified
      if (requiredRequirements.length > 0) {
        const applicantSkillIds = new Set(
          userSkillsData?.map((s: any) => s.skill_id) || [],
        );
        const matchedCount = requiredRequirements.filter((req: any) =>
          applicantSkillIds.has(req.skill_id),
        ).length;
        calculatedMatchScore = Math.round(
          (matchedCount / requiredRequirements.length) * 100,
        );
      }

      // 3. Insert application with match score and snapshot
      const { error: insertError } = await supabase
        .from("applications")
        .insert({
          listing_id: id,
          applicant_id: user.id,
          resume_link: resumeLink,
          message: message,
          declared_skills_snapshot: skillNamesSnapshot,
          match_score: calculatedMatchScore,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setFeedback("You have already applied to this listing.");
        } else {
          throw insertError;
        }
      } else {
        setFeedback("Your application has been successfully submitted!");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setFeedback(
        err.message || "Failed to submit application. Please try again.",
      );
    } finally {
      setIsSubmitted(false);
    }
  };

  return {
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
  };
};
