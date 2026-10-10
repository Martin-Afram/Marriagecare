import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import { PublicLayout } from './components/Layout'
import { AboutPage, ArticlePage, ContactPage, ExpertsPage, HomePage, ProfilePage, ResourcesPage, ServicesPage } from './pages/PublicPages'
import { AuthPage, ForgotPasswordPage } from './pages/AuthPage'
import { BookingPage } from './pages/BookingPage'
import { CounsellorApplicationPage } from './pages/CounsellorApplicationPage'
import { PortalPage } from './pages/PortalPage'
import { useApp } from './hooks/useApp.js'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function ProtectedRoute({ role, children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />
  return children
}

function DashboardRedirect() {
  const { user } = useApp()
  return <Navigate to={user ? `/${user.role}/dashboard` : '/login'} replace />
}

function ToastHost() {
  const { notice } = useApp()
  return notice ? <div className="toast fixed bottom-5 right-5 z-60 px-4 py-3 text-white bg-[#30243a] shadow-lg" role="status" aria-live="polite">{notice}</div> : null
}

function NotFound() {
  return <main className="not-found"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>Let’s find the right way.</h1><p>This page may have moved. You can start again from the home page.</p><a className="button button-primary" href="/">Return home</a></main>
}

function AppRoutes() {
  return <><ScrollToTop /><Routes>
    <Route element={<PublicLayout />}>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="services" element={<ServicesPage />} />
      <Route path="experts" element={<ExpertsPage />} />
      <Route path="experts/:expertId" element={<ProfilePage />} />
      <Route path="resources" element={<ResourcesPage />} />
      <Route path="resources/:articleId" element={<ArticlePage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="apply-as-counsellor" element={<CounsellorApplicationPage />} />
    </Route>
    <Route path="login" element={<AuthPage mode="login" />} />
    <Route path="register" element={<AuthPage mode="register" />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />
    <Route path="book-appointment" element={<BookingPage />} />
    <Route path="booking-confirmation/:bookingId" element={<BookingPage confirmation />} />
    <Route path="dashboard" element={<DashboardRedirect />} />
    {['client', 'expert', 'admin'].map((role) => <Route key={role} path={`${role}/*`} element={<ProtectedRoute role={role}><PortalPage role={role} /></ProtectedRoute>} />)}
    <Route path="*" element={<NotFound />} />
  </Routes></>
}

export default function App() {
  return <AppProvider><BrowserRouter><AppRoutes /><ToastHost /></BrowserRouter></AppProvider>
}