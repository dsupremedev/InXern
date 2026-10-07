import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { SkillRequirement } from "../components/common/SkillsPicker";

export const useListingManagement = (listingId?: string) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"job" | "internship">("internship");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState<
    "draft" | "published" | "closed" | "archived"
  >("draft");
  const [requirements, setRequirements] = useState<SkillRequirement[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApplicants, setHasApplications] = useState(false);

  // Check if applications exist for this listing
  const checkIfApplied = async (targetId: string) => {
    const { count, error } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("listing_id", targetId);

    if (!error && count && count > 0) {
      setHasApplications(true);
    }
  };

  // If editing an existing listing, fetch its data & check for applicants
  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async () => {
      setLoading(true);

      // Run both fetches concurrently
      await Promise.all([
        (async () => {
          const { data: listingData, error: lError } = await supabase
            .from("listings")
            .select("*")
            .eq("id", listingId)
            .single();

          if (lError) {
            setError(lError.message);
            return;
          }

          if (listingData) {
            setTitle(listingData.title);
            setDescription(listingData.description);
            setType(listingData.type);
            setDeadline(
              listingData.deadline ? listingData.deadline.split("T")[0] : "",
            );
            setStatus(listingData.status);
          }
        })(),
        (async () => {
          const { data: reqData } = await supabase
            .from("listing_requirements")
            .select("skill_id, requirement_type, skills(name)")
            .eq("listing_id", listingId);

          if (reqData) {
            setRequirements(
              reqData.map((r: any) => ({
                skill_id: r.skill_id,
                skill_name: r.skills?.name,
                requirement_type: r.requirement_type,
              })),
            );
          }
        })(),
        checkIfApplied(listingId), // Automatically run application check on load!
      ]);

      setLoading(false);
    };

    fetchListing();
  }, [listingId]);

  // const saveListing = async (targetStatus: "draft" | "published") => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     // Block update entirely if applications have already been submitted
  //     if (listingId && hasApplicants) {
  //       throw new Error(
  //         "Cannot edit listing content after applications have been received.",
  //       );
  //     }

  //     const { data: userData, error: uError } = await supabase.auth.getUser();
  //     if (uError || !userData.user) throw new Error("Not authenticated");

  //     // Get user's org_id
  //     const { data: profile } = await supabase
  //       .from("profiles")
  //       .select("organization_id")
  //       .eq("id", userData.user.id)
  //       .single();

  //     if (!profile || !profile.organization_id)
  //       throw new Error("Organization profile not found.");

  //     if (!deadline) throw new Error("Deadline is required.");

  //     const listingPayload = {
  //       org_id: profile.organization_id,
  //       title,
  //       description,
  //       type,
  //       deadline: new Date(deadline).toISOString(),
  //       status: targetStatus,
  //     };

  //     let currentListingId = listingId;

  //     if (listingId) {
  //       // Update
  //       const { error: updateError } = await supabase
  //         .from("listings")
  //         .update(listingPayload)
  //         .eq("id", listingId);
  //       if (updateError) throw updateError;
  //     } else {
  //       // Insert
  //       const { data: newListing, error: insertError } = await supabase
  //         .from("listings")
  //         .insert([listingPayload])
  //         .select("id")
  //         .single();
  //       if (insertError) throw insertError;
  //       currentListingId = newListing.id;
  //     }

  //     // Sync requirements (delete old, insert new)
  //     if (currentListingId) {
  //       await supabase
  //         .from("listing_requirements")
  //         .delete()
  //         .eq("listing_id", currentListingId);

  //       if (requirements.length > 0) {
  //         const reqPayloads = requirements.map((r) => ({
  //           listing_id: currentListingId,
  //           skill_id: r.skill_id,
  //           requirement_type: r.requirement_type,
  //         }));
  //         const { error: reqError } = await supabase
  //           .from("listing_requirements")
  //           .insert(reqPayloads);
  //         if (reqError) throw reqError;
  //       }
  //     }

  //     return { success: true };
  //   } catch (err: any) {
  //     setError(err.message || "Failed to save listing");
  //     return { success: false, error: err.message };
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const saveListing = async (targetStatus: "draft" | "published") => {
    try {
      setLoading(true);
      setError(null);

      // Block update entirely if applications have already been received and trying to modify
      if (listingId && hasApplicants) {
        throw new Error(
          "Cannot edit listing content after applications have been received.",
        );
      }

      const { data: userData, error: uError } = await supabase.auth.getUser();
      if (uError || !userData.user) throw new Error("Not authenticated");

      // Get user's org_id and organization status
      const { data: profile } = await supabase
        .from("profiles")
        .select("organization_id, organizations(status)")
        .eq("id", userData.user.id)
        .single();

      if (!profile || !profile.organization_id)
        throw new Error("Organization profile not found.");

      // PUBLISH VALIDATION CHECKS
      if (targetStatus === "published") {
        // 1. Check if organization is approved
        // Note: adjust 'approved' if your enum uses a different string like 'active' or 'verified'
        const orgStatus = (profile.organizations as any)?.status;
        if (orgStatus && orgStatus !== "approved" && orgStatus !== "active") {
          throw new Error(
            "Your organization must be approved before you can publish listings.",
          );
        }

        // 2. Check for at least one required skill
        const hasRequiredSkill = requirements.some(
          (r) => r.requirement_type === "required",
        );
        if (!hasRequiredSkill) {
          throw new Error(
            "A published listing must have at least one 'Required' skill.",
          );
        }

        // 3. Check for a valid future deadline
        if (!deadline) {
          throw new Error("Application deadline is required.");
        }
        const deadlineDate = new Date(deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of today

        if (deadlineDate <= today) {
          throw new Error(
            "The application deadline must be set to a future date.",
          );
        }
      }

      if (!deadline) throw new Error("Deadline is required.");

      const listingPayload = {
        org_id: profile.organization_id,
        title,
        description,
        type,
        deadline: new Date(deadline).toISOString(),
        status: targetStatus,
      };

      let currentListingId = listingId;

      if (listingId) {
        // Update
        const { error: updateError } = await supabase
          .from("listings")
          .update(listingPayload)
          .eq("id", listingId);
        if (updateError) throw updateError;
      } else {
        // Insert
        const { data: newListing, error: insertError } = await supabase
          .from("listings")
          .insert([listingPayload])
          .select("id")
          .single();
        if (insertError) throw insertError;
        currentListingId = newListing.id;
      }

      // Sync requirements (delete old, insert new)
      if (currentListingId) {
        await supabase
          .from("listing_requirements")
          .delete()
          .eq("listing_id", currentListingId);

        if (requirements.length > 0) {
          const reqPayloads = requirements.map((r) => ({
            listing_id: currentListingId,
            skill_id: r.skill_id,
            requirement_type: r.requirement_type,
          }));
          const { error: reqError } = await supabase
            .from("listing_requirements")
            .insert(reqPayloads);
          if (reqError) throw reqError;
        }
      }

      return { success: true };
    } catch (err: any) {
      setError(err.message || "Failed to save listing");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  return {
    title,
    setTitle,
    description,
    setDescription,
    type,
    setType,
    deadline,
    setDeadline,
    status,
    requirements,
    setRequirements,
    loading,
    error,
    saveListing,
    hasApplicants,
    setHasApplications,
    checkIfApplied,
  };
};
