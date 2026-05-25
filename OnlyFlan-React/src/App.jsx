import { Navigate, Route, Routes } from 'react-router-dom'
import AppNavbar from './components/AppNavbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import CreatorSearchPage from './pages/CreatorSearchPage.jsx'
import CreatorProfilePage from './pages/CreatorProfilePage.jsx'
import CreatorDashboardPage from './pages/CreatorDashboardPage.jsx'
import CreatorIncomePage from './pages/CreatorIncomePage.jsx'
import FollowerFeedPage from './pages/FollowerFeedPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import CreatorsListPage from './pages/CreatorsListPage.jsx'
import DonationHistoryPage from './pages/DonationHistoryPage.jsx'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/creators/search" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/creators/search" element={<CreatorSearchPage />} />
          <Route path="/creators/:id/profile" element={<CreatorProfilePage />} />

          <Route element={<ProtectedRoute requiredRole="creator" />}>
          <Route path="/creators" element={<CreatorsListPage />} />
            <Route path="/creator/dashboard" element={<CreatorDashboardPage />} />
            <Route path="/creator/income" element={<CreatorIncomePage />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="follower" />}>
            <Route path="/follower/feed" element={<FollowerFeedPage />} />
            <Route path="/follower/favorites" element={<FavoritesPage />} />
            <Route path="/follower/donations" element={<DonationHistoryPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
