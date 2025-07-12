import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const userId = location.state?.userId;

  const handleReset = async () => {
    setMessage('');
    setError('');
    try {
      await axios.post('http://localhost:5001/api/auth/reset-password', {
        userId,
        newPassword: password,
      });
      setMessage('Password reset successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1500); // Optional delay before redirect
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed');
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
          Reset Password
        </h3>

        {message && (
          <div className="alert alert-success text-center py-2" role="alert">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger text-center py-2" role="alert">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="Enter new password"
          className="form-control mb-4 text-center fw-semibold"
          style={{
            border: '2px solid #6f42c1',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 4px 8px rgba(111,66,193,0.1)',
            fontSize: '1rem',
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          onClick={handleReset}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
