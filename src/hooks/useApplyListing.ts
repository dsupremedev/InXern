import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useParams } from "react-router-dom";
import { useState } from "react";

export interface organizationProps {
  name: string;
}

export interface applyListingProps {
  id: string;
  title: string;
  organizations: organizationProps;
}

export const useApplyListing = () => {
  const { id } = useParams<{ id: string }>();
  const [listedData, setListedData] = useState<applyListingProps | null>(null);
  const [resumeLink, setResumeLink] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchListingData = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("id, title, organizations( name )")
          .eq("id", id)
          .single();

        if (data) {
          setListedData(data);
        }
      } catch (error) {}
    };
    fetchListingData();
  }, [id]);

  const manageSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listedData?.id) return;

    setIsSubmitted(true);
    setFeedback("");

    try {
      const { data: submissonData, error: submissionError } =
        await supabase.rpc("create_application", {
          p_listing_id: listedData.id,
          p_resume_link: resumeLink,
          p_message: message,
        });

      if (submissionError) throw submissionError;
    } catch (error: any) {
      console.error("Submission error", error);
      setFeedback(error.message || "Failed to submit application");
    } finally {
      setIsSubmitted(false);
    }
  };

  console.log("Result is", listedData);

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
