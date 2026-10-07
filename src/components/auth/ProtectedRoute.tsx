// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// interface ProtectedRouteProps {
//   allowedRoles?: ("applicant" | "org_admin" | "platform_admin")[];
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   allowedRoles,
// }) => {
//   const { user, profile, loading } = useAuth();

//   if (loading) {
//     return (
//       <div>
//         <h1>Loading...</h1>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: ("applicant" | "org_admin" | "platform_admin")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  // Force org_admins without an organization_id to the setup page
  if (
    profile?.role === "org_admin" &&
    !profile?.organization_id &&
    location.pathname !== "/org/setup"
  ) {
    return <Navigate to="/org/setup" replace />;
  }

  // Prevent org_admins who ALREADY have an organization from accessing the setup page again
  if (
    profile?.role === "org_admin" &&
    profile?.organization_id &&
    location.pathname === "/org/setup"
  ) {
    return <Navigate to="/org/create-listing" replace />;
  }

  return <Outlet />;
};
