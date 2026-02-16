import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import PersonalInfo from './pages/formSteps/PersonalInfo';
import Education from './pages/formSteps/Education';
import Experience from './pages/formSteps/Experience';
import Skills from './pages/formSteps/Skills';
import ExtraInfo from './pages/formSteps/ExtraInfo';
import Preview from './pages/preview/Preview';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import { ResumeProvider } from './context/ResumeContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/form/personal" element={<ProtectedRoute><PersonalInfo /></ProtectedRoute>} />
        <Route path="/form/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
        <Route path="/form/experience" element={<ProtectedRoute><Experience /></ProtectedRoute>} />
        <Route path="/form/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
        <Route path="/form/extra" element={<ProtectedRoute><ExtraInfo /></ProtectedRoute>} />
        <Route path="/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ResumeProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              <main className="pt-16">
                <AnimatedRoutes />
              </main>
              <Footer />
            </div>
          </Router>
        </ResumeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;