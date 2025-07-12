import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/MainLayout';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import VerifyOtp from './pages/VerifyOtp';
import UserDashboard from './pages/UserDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyOtpReset from './pages/VerifyOtpReset';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile  from './pages/UserProfile';
import DocumentUpload  from './pages/DocumentUpload';
import GenerateTest from './pages/generate-test';
import TestStartScreen from './pages/TestStartScreen'; 
import TestAttemptPage from './pages/TestAttemptPage';
import AdminResultReview from './pages/AdminResultReview';
import UserResultList from './pages/UserResultList';
import UserResultView from './pages/UserResultView';
import EmotionReportPage from './pages/EmotionReportPage';




// ✅ PrivateRoute component defined inside App
function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
         <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/upload-documents" element={<DocumentUpload />} />
        <Route path="/generate-test" element={<GenerateTest />} />
        <Route path="/test/start/:bookingId" element={<TestStartScreen />} />
      <Route path="/test/attempt/:bookingId" element={<TestAttemptPage />} />
      <Route path="/admin/review/:resultId" element={<AdminResultReview />} />
      <Route path="/my/results" element={<UserResultList />} />
      <Route path="/my/:id" element={<UserResultView />} />
      <Route path="/emotion-report/:bookingId" element={<EmotionReportPage />} />






        
        {/* ✅ Protected Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp-reset" element={<VerifyOtpReset />} />
        <Route path="/reset-password" element={<ResetPassword />} /> */
        {/* { Optional fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
