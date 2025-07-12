import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function VerifyOtpReset() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ''); // Only digits
    if (!value) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    const fullOtp = otp.join('');
    try {
      await axios.post('http://localhost:5001/api/auth/verify-otp', {
        userId,
        otp: fullOtp,
      });
      setSuccessMsg('OTP Verified! ');
      setTimeout(() => {
        navigate('/reset-password', { state: { userId } });
      }, 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Verification failed');
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
        className="bg-white shadow p-5"
        style={{
          maxWidth: '420px',
          width: '100%',
          borderRadius: '3rem',
        }}
      >
        <h3 className="text-center mb-4" style={{ color: '#6f42c1' }}>
          Verify OTP
        </h3>

        {/* Alerts */}
        {successMsg && (
          <div className="alert alert-success text-center py-2">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="alert alert-danger text-center py-2">{errorMsg}</div>
        )}

        <div className="d-flex justify-content-between mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="form-control text-center mx-1"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              ref={(el) => (inputsRef.current[index] = el)}
              style={{
                width: '50px',
                height: '50px',
                fontSize: '1.3rem',
                color: 'black',
                border: '2px solid #6f42c1',
                borderRadius: '12px',
                fontWeight: 'bold',
                boxShadow: '0 0 6px rgba(111, 66, 193, 0.4)',
              }}
            />
          ))}
        </div>

        <button
          className="btn w-100"
          style={{
            backgroundColor: '#6f42c1',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '50px',
            padding: '12px 0',
            fontSize: '1rem',
            boxShadow: '0 4px 10px rgba(111, 66, 193, 0.3)',
          }}
          onClick={handleVerify}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
