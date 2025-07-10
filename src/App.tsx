import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/dashboard'
import SignIn from './pages/SignIn'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route
          path="/signin"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <SignIn onSignIn={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onSignOut={() => setIsAuthenticated(false)} />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route path="/" element={<Navigate to="/signin" replace />} />
      </Routes>
    </div>
  )
}

export default App
