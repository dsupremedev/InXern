import React from "react";
import { Home } from "./components/Home";
import { SignUp } from "./components/auth/SignUp";
import { Login } from "./components/auth/Login";

import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CgLogIn } from "react-icons/cg";
export const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
};
