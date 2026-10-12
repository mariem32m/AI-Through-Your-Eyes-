import { Routes, Route } from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { Questionnaire } from "./pages/Questionnaire";
import { ThankYou } from "./pages/ThankYou";
import { Dashboard } from "./pages/Dashboard";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/play" element={<Questionnaire />} />
      <Route path="/questionnaire" element={<Questionnaire />} />
      <Route path="/thankyou" element={<ThankYou />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/host" element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}