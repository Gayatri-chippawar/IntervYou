import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyOtp() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  useEffect(() => {
    if (!userId) {
      setErrorMsg('User ID missing. Please register again.');
    }
  }, [userId]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleVerify = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const otpValue = otp.join('');
      await axios.post('http://localhost:5001/api/auth/verify-otp', {
        userId: String(userId),
        otp: otpValue,
      });

      localStorage.removeItem('pendingUserId');
      setSuccessMsg('OTP Verified Successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Verify error:', err.response?.data || err.message);
      setErrorMsg('Invalid OTP or session expired.');
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: 'url("/oottp.svg")',
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
          borderRadius: '1.5rem',
          backdropFilter: 'blur(5px)',
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: '#6f42c1' }}>
          Verify OTP
        </h2>

        {/* Bootstrap Alerts */}
        {successMsg && (
          <div className="alert alert-success text-center py-2" role="alert">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="alert alert-danger text-center py-2" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="d-flex justify-content-between mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              className="form-control text-center fw-bold fs-4 mx-1"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '10px',
                border: '2px solid #6f42c1',
                boxShadow: '0 0 5px rgba(0,0,0,0.1)',
              }}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          className="btn w-100 text-white fw-semibold"
          style={{
            backgroundColor: '#6f42c1',
            borderRadius: '30px',
            padding: '10px 0',
            fontSize: '1.1rem',
            boxShadow: '0 4px 10px rgba(111,66,193,0.3)',
            transition: '0.3s ease',
          }}
        >
          Verify
        </button>
      </div>
    </div>
  );
}
