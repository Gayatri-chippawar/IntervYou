import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Eye, EyeOff } from 'lucide-react';


const RegisterPage = () => {
  // ✅ Updated
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  password: '',
  role: ''
});

  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/register', formData);
      setMsg(data.message);
      localStorage.setItem("pendingUserId", data.userId);
      navigate('/verify-otp', { state: { email: formData.email, userId: data.userId } });
    } catch (err) {
      setError(err.response?.data?.error || 'Register failed');
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex p-0">
      {/* Left - Full Form Section */}
      <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#ffffff' }}>
        <div className="w-100 px-4" style={{ maxWidth: '500px' }}>
          <h2 className="text-center mb-4 fw-bold" style={{ color: '#6f42c1' }}>
  Register
</h2>


          {msg && <div className="alert alert-success text-center py-2">{msg}</div>}
          {error && <div className="alert alert-danger text-center py-2">{error}</div>}

          <form onSubmit={handleRegister}>

            <div className="mb-3">
              <label className="form-label text-secondary">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>


            <div className="mb-3">
              <label className="form-label text-secondary">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-secondary">Phone</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-secondary">Role</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your role STUDENT/INTERVIEWER"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />
            </div>

            <div className="mb-3">
      <label className="form-label text-secondary">Password</label>
      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          className="form-control"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <span
          className="input-group-text bg-white border-start-0"
          onClick={() => setShowPassword(!showPassword)}
          style={{ cursor: 'pointer' }}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      </div>
    </div>

            

            <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: '#6f42c1' }}>
              Register
            </button>
          </form>

          <p className="text-center mt-4 text-muted">
            Already have an account?{' '}
            <a href="/login" className="text-decoration-none fw-semibold" style={{ color: '#6f42c1' }}>
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Right - Image Section */}
      <div className="d-none d-md-block col-md-6 p-0">
        <img
          src="/register.svg"
          alt="Register Visual"
          className="img-fluid h-100 w-100"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};

export default RegisterPage;
