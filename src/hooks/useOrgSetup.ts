import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export const useOrgSetup = () => {
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in to set up an organization.");
      return;
    }

    if (!orgName.trim()) {
      setError("Organization name cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Insert the new organization (status defaults to 'pending' via your schema)
      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert([{ name: orgName.trim(), status: "pending" }])
        .select("id")
        .single();

      if (orgError) throw orgError;

      // 2. Link the generated organization_id to the current user's profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ organization_id: orgData.id })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // 3. Force a reload so the AuthContext fetches the updated profile with the new organization_id
      window.location.href = "/org/create-listing";
    } catch (err: any) {
      setError(err.message || "Failed to set up organization.");
    } finally {
      setLoading(false);
    }
  };

  return {
    orgName,
    setOrgName,
    loading,
    error,
    handleSetup,
  };
};
