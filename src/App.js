import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Quiz from './pages/Quiz';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Navbar from './components/Navbar';
import QuestionAdd from './pages/QuestionAdd';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/add" element={<QuestionAdd />} />
      </Routes>
    </Router>
  );
}
