import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Content from "./components/Content/Content";
import ChatApp from "./components/Chat/Chat";

import SearchEvent from "./components/Map/SearchEvent";

import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";

import { ToastContainer } from "react-toastify";
import FeedbackList from "./components/Content/FeedbackList";
import QuizComponent from "./components/ActionHub/Quiz";
import QuestionnairePage from "./components/ActionHub/QuestionnairePage";
import ResultsPage from "./components/ActionHub/ResultsPage";
import ActionHubPage from "./components/ActionHub/ActionHubPage";
import HeroSection from "./components/Home/HeroSection";
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/content" element={<Content />} />
        <Route path="/map" element={<SearchEvent />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/quiz" element={<QuestionnairePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/action-hub" element={<ActionHubPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/content/feedback" element={<FeedbackList />} />
      </Routes>
    </Router>
  );
}

export default App;
