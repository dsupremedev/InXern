import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
type SignableRole = "applicant" | "org_admin";

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<SignableRole>("applicant");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return <div className="bg-red-800 w-100 h-100"></div>;
};
