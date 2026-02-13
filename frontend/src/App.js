import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import LandingPage from "./pages/LandingPage";
import PreMoodQuestions from "./pages/PreMoodQuestions";
import MoodSelection from "./pages/MoodSelection";
import MealSuggestions from "./pages/MealSuggestions";
import FeedbackPage from "./pages/FeedbackPage";
import AboutPage from "./pages/AboutPage";
import SavedMeals from "./pages/SavedMeals";
import NotFound from "./pages/NotFound";

import { ThemeProvider } from "./theme";

function PageShell({ children }) {
  const location = useLocation();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <div key={location.pathname} className="page-in">
        {children}
      </div>
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* Layout so footer stays at bottom */}
        <div className="min-h-screen flex flex-col transition-colors">
          <Navbar />

          <Routes>
            <Route
              path="/"
              element={
                <PageShell>
                  <LandingPage />
                </PageShell>
              }
            />

            <Route
              path="/questions"
              element={
                <PageShell>
                  <PreMoodQuestions />
                </PageShell>
              }
            />

            <Route
              path="/moods"
              element={
                <PageShell>
                  <MoodSelection />
                </PageShell>
              }
            />

            <Route
              path="/suggestions"
              element={
                <PageShell>
                  <MealSuggestions />
                </PageShell>
              }
            />

            <Route
              path="/feedback"
              element={
                <PageShell>
                  <FeedbackPage />
                </PageShell>
              }
            />

            <Route
              path="/about"
              element={
                <PageShell>
                  <AboutPage />
                </PageShell>
              }
            />

            <Route
              path="/saved"
              element={
                <PageShell>
                  <SavedMeals />
                </PageShell>
              }
            />

            {/* ✅ 404 CATCH-ALL */}
            <Route
              path="*"
              element={
                <PageShell>
                  <NotFound />
                </PageShell>
              }
            />
          </Routes>

          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}
