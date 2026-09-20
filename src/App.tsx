import React from "react";
import { Home } from "./components/Home";
import { SignUp } from "./components/auth/SignUp";
import { Navbar } from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
export const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="signup" element={<SignUp />} />
        </Routes>
      </main>
    </Router>
  );
};
