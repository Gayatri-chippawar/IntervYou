import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Eye, EyeOff } from 'lucide-react';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/login', {
        email,
        password,
      });
      const { token, user } = res.data;
      localStorage.setItem('userId', user._id);
      localStorage.setItem('token', token);
      console.log("Saved token:", token);  // ✅ Save token for API use
      navigate('/dashboard');


      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Invalid email or password');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Left Image Panel */}
      <div className="d-none d-md-block" style={{ width: '50%' }}>
        <img
          src="/login.svg"
          alt="Login Visual"
          className="h-100 w-100"
          style={{ objectFit: 'cover' }}
        />
      </div>

      {/* Right Login Panel */}
      <div className="d-flex align-items-center justify-content-center bg-white" style={{ width: '50%' }}>
        <div className="w-100 px-4" style={{ maxWidth: '400px' }}>
          <h2 className="text-center mb-4" style={{ color: '#6f42c1' }}>SIGN IN</h2>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label text-secondary">E-mail address / Mobile number</label>
              <input
                type="text"
                className="form-control border-purple"
                placeholder="Enter E-mail address Or Mobile number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
      <label className="form-label text-secondary">Enter Password</label>
      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          className="form-control border-purple"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          className="input-group-text border-purple bg-white cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: 'pointer' }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
    </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="remember" />
              <label className="form-check-label" htmlFor="remember">Remember Me</label>
            </div>
            <a href="/forgot-password" className="text-decoration-none text-purple">Forgot password?</a>
          </div>

            <button type="submit" className="btn w-100 mb-3 text-white" style={{ backgroundColor: '#6f42c1' }}>
              Sign In
            </button>
          </form>

          <p className="text-center mt-4">
            Don’t have an account?{' '}
            <a href="/register" className="fw-semibold" style={{ color: '#6f42c1' }}>
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
