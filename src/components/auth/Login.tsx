import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import applicant from "../../assets/icons/applicant-icon.svg";
import org from "../../assets/icons/org-icon.svg";
import { useState } from "react";
import { Link } from "react-router-dom";

export const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [formInfo, setFormInfo] = useState({
    email: "",
    password: "",
  });

  const manageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const passwordVisibility = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  //   I need to handle login  from supabase
  const manageLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    // I need to handle form validation
    if (!formInfo.email || !formInfo.password) {
      setLoading(false);
      return setStatus({
        type: "error",
        message: "Please enter both email and password.",
      });
    }

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formInfo.email,
          password: formInfo.password,
        });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        setStatus({
          type: "success",
          message: "Login Successful",
        });

        //   I will handle automatic role redirection here LiaTerminalSolid, once i build the destinations
      }
    } catch (error: any) {
      setStatus({
        type: "error",
        message: "Invalid login credentials, Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-brand-page-bg flex flex-col justify-center
      items-center border-2"
    >
      <h1 className="my-[28px] text-[24px] font-[700]">Welcome back</h1>
      <p className="my-[8.33px] text-status-applied text-[14px]">
        Don't have an account?{" "}
        <Link to="/signup">
          <span className="text-brand-teal">SignUp</span>
        </Link>
      </p>
      <div
        className="bg-[#FFFFFF] border-brand-border border-[0.7px]
       shadow-[0_2px_12px_0_rgba(0,0,0,0.04)] p-[24px] my-[32px]
    w-[400px] rounded-[16px]"
      >
        {/* input field section */}
        <form onSubmit={manageLogin}>
          <div>
            {" "}
            <label
              htmlFor="email"
              className="text-[14px] font-[500] text-brand-text-dark"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formInfo.email}
              onChange={manageChange}
              placeholder="you@exmaple.com"
              className="w-full text-[14px] font-[500] h-[41px] my-[6px] px-[16px] py-[10px] border border-brand-border text-brand-text-muted rounded-[12px]"
            />
          </div>
          <div>
            <div className="flex justify-between">
              {" "}
              <label
                htmlFor="password"
                className="text-[14px] font-[500] text-brand-text-dark"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  setStatus({
                    type: "error",
                    message:
                      "Password reset instructions will be sent to your email.",
                  })
                }
                className="text-[12px] font-[400] text-brand-teal hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                value={formInfo.password}
                onChange={manageChange}
                placeholder="At least 8 characters"
                type={showPassword ? "text" : "password"}
                className="relative w-full text-[14px] font-[500] h-[41px] my-[6px] px-[16px] py-[10px] border border-brand-border text-brand-text-muted rounded-[12px]"
              />

              <button
                type="button"
                onClick={passwordVisibility}
                className="absolute right-2 top-[10px] bg-brand-bg-tint px-3 py-2 text-[11px] font-semibold rounded-lg text-brand-teal"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="flex">
            <button
              type="submit"
              className="w-full text-[14px] font-[600] h-[41px] my-[6px] px-[16px] py-[10px] border border-brand-border bg-brand-teal rounded-[12px] cursor-pointer text-[#FFFFFF]"
            >
              {loading ? "Logggin in..." : "Login"}
            </button>
          </div>
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
      <p className="my-[8.33px] text-status-applied text-[14px]">
        Platform admin?{" "}
        <Link to="/signup">
          <span className="text-brand-teal">Login</span>
        </Link>
      </p>
    </div>
  );
};
