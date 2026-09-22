import React from "react";
import { Home } from "./components/Home";
import { SignUp } from "./components/auth/SignUp";
import { Login } from "./components/auth/Login";
import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
import { ProtectedRoute } from "../src/components/auth/ProtectedRoute";
import { Navigate } from "react-router-dom";
import { SkillProfile } from "./components/SkillProfile";
export const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={["applicant"]} />}>
            <Route path="skill-profile" element={<SkillProfile />} />

            {/* I will add /profile-setup, /my-applications, etc. here */}
          </Route>

          {/* Protected Routes for Organizations Only */}
          <Route element={<ProtectedRoute allowedRoles={["org_admin"]} />}>
            {/* I will add /org/dashboard, /org/create-listing, etc. here */}
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
};
