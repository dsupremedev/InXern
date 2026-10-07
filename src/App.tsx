// import React from "react";
// import { Home } from "./components/Home";
// import { SignUp } from "./components/auth/SignUp";
// import { Login } from "./components/auth/Login";
// import { Navbar } from "./components/Navbar";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { ProtectedRoute } from "../src/components/auth/ProtectedRoute";
// import { Navigate } from "react-router-dom";
// import { SkillProfile } from "./components/SkillProfile";
// import { BrowseListings } from "./components/Pages/BrowseListings";
// import { ListingDetail } from "./components/Pages/ListingDetail";
// import { ApplyListing } from "./components/Pages/ApplyListing";
// import { ListingFormPage } from "./components/Pages/ListingFormPage";
// import { OrgSetupPage } from "./components/Pages/OrgSetupPage";
// import { OrgDashboardPage } from "./components/Pages/OrgDashboard";
// import { AdminLayout } from "./components/Layouts/AdminLayout";
// import { AdminDashboardPage } from "./components/Pages/AdminDashboardPage";
// import { AdminLoginPage } from "./components/auth/AdminLoginPage";
// import { AdminSkillsPage } from "./components/Pages/AdminSkillsPage";

// export const App: React.FC = () => {
//   return (
//     <Router>
//       <Navbar />
//       <main>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="signup" element={<SignUp />} />
//           <Route path="login" element={<Login />} />
//           <Route path="admin/login" element={<AdminLoginPage />} />

//           <Route element={<ProtectedRoute allowedRoles={["applicant"]} />}>
//             <Route path="skill-profile" element={<SkillProfile />} />
//             <Route path="browse" element={<BrowseListings />} />
//             <Route path="listing-detail/:id" element={<ListingDetail />} />
//             <Route path="apply-listing/:id" element={<ApplyListing />} />

//             {/* I will add /profile-setup, /my-applications, etc. here */}
//           </Route>

//           {/* Protected Routes for Organizations Only */}
//           <Route element={<ProtectedRoute allowedRoles={["org_admin"]} />}>
//             {/* I will add /org/dashboard, /org/create-listing, etc. here */}
//             <Route path="org/create-listing" element={<ListingFormPage />} />
//             <Route path="org/edit-listing/:id" element={<ListingFormPage />} />
//             <Route path="org/setup" element={<OrgSetupPage />} />
//             <Route path="org/dashboard" element={<OrgDashboardPage />} />
//           </Route>

//           {/* Protected Routes for Platform Admins Only */}
//           <Route element={<ProtectedRoute allowedRoles={["platform_admin"]} />}>
//             <Route element={<AdminLayout />}>
//               <Route path="admin/dashboard" element={<AdminDashboardPage />} />
//               <Route path="admin/skills" element={<AdminSkillsPage />} />
//             </Route>
//           </Route>

//           {/* Fallback route */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </Router>
//   );
// };

import React from "react";
import { Home } from "./components/Home";
import { SignUp } from "./components/auth/SignUp";
import { Login } from "./components/auth/Login";
import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "../src/components/auth/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { SkillProfile } from "./components/SkillProfile";
import { BrowseListings } from "./components/Pages/BrowseListings";
import { ListingDetail } from "./components/Pages/ListingDetail";
import { ApplyListing } from "./components/Pages/ApplyListing";
import { ListingFormPage } from "./components/Pages/ListingFormPage";
import { OrgSetupPage } from "./components/Pages/OrgSetupPage";
import { OrgDashboardPage } from "./components/Pages/OrgDashboard";
import { AdminLayout } from "./components/Layouts/AdminLayout";
import { AdminDashboardPage } from "./components/Pages/AdminDashboardPage";
import { AdminListingsPage } from "./components/Pages/AdminListingsPage";
import { AdminSkillsPage } from "./components/Pages/AdminSkillsPage";
import { AdminLoginPage } from "./components/auth/AdminLoginPage";
import { AdminTestRunnerPage } from "./components/Pages/AdminTestRunnerPage";
import { AdminSecurityTestsPage } from "./components/Pages/AdminSecurityTestPage";

export const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="admin/login" element={<AdminLoginPage />} />

          {/* Protected Routes for Applicants Only */}
          <Route element={<ProtectedRoute allowedRoles={["applicant"]} />}>
            <Route path="skill-profile" element={<SkillProfile />} />
            <Route path="browse" element={<BrowseListings />} />
            <Route path="listing-detail/:id" element={<ListingDetail />} />
            <Route path="apply-listing/:id" element={<ApplyListing />} />
          </Route>

          {/* Protected Routes for Organizations Only */}
          <Route element={<ProtectedRoute allowedRoles={["org_admin"]} />}>
            <Route path="org/create-listing" element={<ListingFormPage />} />
            <Route path="org/edit-listing/:id" element={<ListingFormPage />} />
            <Route path="org/setup" element={<OrgSetupPage />} />
            <Route path="org/dashboard" element={<OrgDashboardPage />} />
          </Route>

          {/* Protected Routes for Platform Admins Only */}
          <Route element={<ProtectedRoute allowedRoles={["platform_admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="admin/listings" element={<AdminListingsPage />} />
              <Route path="admin/skills" element={<AdminSkillsPage />} />
              <Route path="admin/tests" element={<AdminTestRunnerPage />} />
              <Route
                path="admin/security-tests"
                element={<AdminSecurityTestsPage />}
              />
            </Route>
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
};
