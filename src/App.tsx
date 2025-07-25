import { Routes, Route, useNavigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import LanguageTrainer from './pages/LanguageTrainer'
import Layout from './components/Layout'
import EventsPage from './pages/Events'

function App() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route
          path="/signin"
          element={
            <SignIn />
          }
        />
        <Route
          path="/" element={<Layout onSignOut={() => navigate("/signin")} />}
        >
          <Route
            path="/language"
            element={
              <LanguageTrainer />
            }
          />
          <Route
            path="/events"
            element={
              <EventsPage />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
