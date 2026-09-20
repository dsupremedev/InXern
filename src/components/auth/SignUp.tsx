import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import applicant from "../../assets/icons/applicant-icon.svg";
import org from "../../assets/icons/org-icon.svg";
import { useState } from "react";
type SignableRole = "applicant" | "org_admin";

export const SignUp: React.FC = () => {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  //   const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<SignableRole>("applicant");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  //   I need a function for password visibility
  const passwordVisibility = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  //   I need to have a state object that keeps track of the input fileds in the form
  const [formInfo, setFormInfo] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  //   I need to have a function that handles submission
  const manageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // I need to extract the input prop i will work with
    const { name, value } = e.target;

    setFormInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //   this handles account creation
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    setErrorMsg(null);

    // I need to handle form validation
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(formInfo.email)) {
      setLoading(false);
      return setStatus({
        type: "error",
        message:
          "Registration is restricted. You must use a valid @gmail.com address.",
      });
    }

    if (formInfo.password.length < 8) {
      setLoading(false);
      return setStatus({
        type: "error",
        message:
          "Password is too short. It must be at least 8 characters long.",
      });
    }

    const hasLowerCase = /[a-z]/.test(formInfo.password);
    const hasUpperCase = /[A-Z]/.test(formInfo.password);
    const hasNumber = /[0-9]/.test(formInfo.password);
    const hasSymbol = /[!@#\$%^&*(),.?":{}|<>]/.test(formInfo.password);

    if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSymbol) {
      setLoading(false);
      return setStatus({
        type: "error",
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special symbol.",
      });
    }
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formInfo.email,
        password: formInfo.password,
        options: {
          data: {
            full_name: formInfo.fullName,
            role: role,
          },
        },
      });

      // error handling
      if (authError) {
        throw authError;
      }
      //I need to ensuring that the account is created successfuly in auth.users before inserting to profiles table
      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            full_name: formInfo.fullName,
            role: role,
          },
        ]);

        if (profileError) {
          throw profileError;
        }

        setStatus({
          type: "success",
          message: "Account created successfuly",
        });
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: error.message || "Failed to create account, Please tra again!",
      });
      setErrorMsg(error.message || "An error occured while signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-brand-page-bg flex flex-col justify-center
      items-center border-2"
    >
      <h1 className="my-[28px] text-[24px] font-[700]">Create your account</h1>
      <p className="my-[8.33px] text-status-applied text-[14px]">
        Already have an account? <span className="text-brand-teal">Log in</span>
      </p>

      <div
        className="bg-[#FFFFFF] border-brand-border border-[0.7px]
       shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] h-[505px] p-[24px] my-[32px]
    w-[400px] h-[500px] rounded-[16px]"
      >
        <p className="text-[14px] text-brand-text-dark font-[600]">
          I am signing up as a...
        </p>
        <div className="flex justify-between gap-4">
          {/* applicant container */}
          <div
            className={`flex flex-col gap-4 w-[180px] border-brand-border border-[0.7px] bg-[#FFFFFF] rounded-[12px] my-[12px] p-[16px] ${role === "applicant" ? "border-brand-gold" : ""}`}
            onClick={() => setRole("applicant")}
          >
            <button className="bg-[#F0F0F0] w-[36px] h-[36px] flex rounded-[8px] items-center justify-center">
              <img src={applicant} alt="applicant-icon" className="w-[18px]" />
            </button>

            <div className="flex flex-col gap-1">
              <p className="text-[14px] text-brand-text-dark font-[600]">
                Applicant
              </p>
              <p className="text-[12px] text-brand-text-muted font-[400]">
                Find jobs & internships
              </p>
            </div>
          </div>

          {/* Organization section */}
          <div
            className={`flex flex-col gap-4 w-[180px] border-brand-border border-[0.7px] bg-[#FFFFFF] rounded-[12px] my-[12px] p-[16px] ${role === "org_admin" ? "border-brand-teal" : ""}`}
            onClick={() => setRole("org_admin")}
          >
            <button className="bg-[#F0F0F0] w-[36px] h-[36px] flex rounded-[8px] items-center justify-center">
              <img src={org} alt="org-icon" className="w-[18px]" />
            </button>

            <div className="flex flex-col gap-1">
              <p className="text-[14px] text-brand-text-dark font-[600]">
                Organization
              </p>
              <p className="text-[12px] text-brand-text-muted font-[400]">
                Post listings & hire
              </p>
            </div>
          </div>
        </div>

        {/* input field section */}
        <form onSubmit={handleSignup}>
          <label
            htmlFor="fullName"
            className="text-[14px] font-[500] text-brand-text-dark"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            value={formInfo.fullName}
            onChange={manageChange}
            type="text"
            placeholder="e.g. Amara Osei"
            className="w-full text-[14px] font-[500] h-[41px] my-[6px] px-[16px] py-[10px] border border-brand-border text-brand-text-muted rounded-[12px]"
          />

          <label
            htmlFor="email"
            className="text-[14px] font-[500] text-brand-text-dark"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            value={formInfo.email}
            onChange={manageChange}
            type="email"
            placeholder="you@exmaple.com"
            className="w-full text-[14px] font-[500] h-[41px] my-[6px] px-[16px] py-[10px] border border-brand-border text-brand-text-muted rounded-[12px]"
          />

          <label
            htmlFor="password"
            className="text-[14px] font-[500] text-brand-text-dark"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            value={formInfo.password}
            onChange={manageChange}
            type={showPassword ? "text" : "password"}
            placeholder="At least 8 characters"
            className="relative w-full text-[14px] font-[500] h-[41px] my-[6px] px-[16px] py-[10px] border border-brand-border text-brand-text-muted rounded-[12px]"
          />
          <button
            className="absolute w-[80px] mx-[-90px] my-[10px] bg-brand-bg-tint p-[8px] text-[11px] rounded-lg"
            onClick={passwordVisibility}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>

          <button
            type="submit"
            onClick={handleSignup}
            className="w-full text-[14px] font-[600] h-[41px] my-[6px] px-[16px] py-[10px] border border-brand-border text-brand-text-dark bg-brand-gold rounded-[12px] cursor-pointer"
          >
            {loading ? "Loading..." : "Create account"}
          </button>
        </form>

        {status && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all animate-fadeIn">
            <div
              className={`max-w-sm w-full mx-4 p-6 rounded-xl shadow-2xl text-center border bg-white
            ${status.type === "success" ? "border-green-200" : "border-red-200"}`}
            >
              {/* Status Icon */}
              <div
                className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4 
              ${status.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
              >
                {status.type === "success" ? "✓" : "✕"}
              </div>

              {/* Status Text */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {status.type === "success"
                  ? "Success!"
                  : "Something went wrong"}
              </h3>
              <p className="text-sm text-gray-600 mb-6">{status.message}</p>

              {/* Action Button */}
              <button
                onClick={() => setStatus(null)}
                className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors
                ${status.type === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
