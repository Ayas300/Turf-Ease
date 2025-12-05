import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import FooterWrapper from './components/FooterWrapper'
import Home from './pages/Home'
import AvailableTurfs from './pages/AvailableTurfs'
import Turfs from './pages/Turfs'
import TurfDetails from './pages/TurfDetails'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import BlogSection from './components/BlogSection'
import SectionDivider from './components/SectionDivider'
import Login from './pages/Login'
import SignupSelection from './pages/SignupSelection'
import SignupBooker from './pages/SignupBooker'
import SignupOwner from './pages/SignupOwner'
import SignupAdmin from './pages/SignupAdmin'
import Dashboard from './pages/Dashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AddFacility from './pages/AddFacility'
import ManageBookings from './pages/ManageBookings'
import Analytics from './pages/Analytics'
import UpdateProfile from './pages/UpdateProfile'
import BookTurf from './pages/BookTurf'
import TermsConditions from './pages/TermsConditions'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import ScrollToTop from './components/ScrollToTop'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Home />
              <AvailableTurfs />
              <SectionDivider label={"Sports Insights & Tips"} />
              <BlogSection />
            </>
          } />
          <Route path="/turfs" element={<Turfs />} />
          <Route path="/turf/:id" element={
            <ErrorBoundary>
              <TurfDetails />
            </ErrorBoundary>
          } />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupSelection />} />
          <Route path="/signup/booker" element={<SignupBooker />} />
          <Route path="/signup/owner" element={<SignupOwner />} />
          <Route path="/signup/admin" element={<SignupAdmin />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/owner-dashboard" element={
            <ProtectedRoute requireOwner={true}>
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Functional Pages */}
          <Route path="/add-facility" element={
            <ProtectedRoute requireOwner={true}>
              <AddFacility />
            </ProtectedRoute>
          } />
          <Route path="/manage-bookings" element={
            <ProtectedRoute>
              <ManageBookings />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/update-profile" element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          } />
          <Route path="/book-turf/:id" element={
            <ProtectedRoute>
              <BookTurf />
            </ProtectedRoute>
          } />

          {/* Legal Pages */}
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
        <FooterWrapper />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  )
}
export default App
