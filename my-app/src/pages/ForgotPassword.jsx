import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setMessage('');
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      setMessage('OTP sent to your email');
      setTimeout(() => {
        navigate('/verify-otp-reset', { state: { userId: res.data.userId } });
      }, 1500); // Optional delay before redirect
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/oottp.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        className="bg-white shadow-lg p-5"
        style={{
          maxWidth: '420px',
          width: '90%',
          borderRadius: '2rem',
          backdropFilter: 'blur(4px)',
        }}
      >
        <h3 className="text-center mb-4 fw-bold" style={{ color: '#6f42c1' }}>
          Forgot Password
        </h3>

        {/* Success Message */}
        {message && (
          <div className="alert alert-success text-center py-2" role="alert">
            {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger text-center py-2" role="alert">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="form-control mb-4 text-center fw-semibold"
          style={{
            border: '2px solid #6f42c1',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 4px 8px rgba(111,66,193,0.1)',
            fontSize: '1rem',
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="btn w-100 text-white fw-bold"
          style={{
            backgroundColor: '#6f42c1',
            borderRadius: '30px',
            padding: '12px 0',
            fontSize: '1.1rem',
            boxShadow: '0 4px 10px rgba(111,66,193,0.3)',
          }}
          onClick={handleSendOtp}
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
