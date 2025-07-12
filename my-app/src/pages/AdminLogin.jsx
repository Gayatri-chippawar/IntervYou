import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5001/api/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      setAlert({ message: '✅ Admin login successful!', type: 'success' });
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      setAlert({ message: err.response?.data?.error || "Login failed", type: 'danger' });
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: 'linear-gradient(to right, #e3f2fd, #90caf9, #42a5f5)',
        borderRadius: '20px',
      }}
    >
      <div
        className="bg-white p-5 shadow-lg"
        style={{
          maxWidth: '420px',
          width: '100%',
          borderRadius: '30px',
        }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">Admin Login</h3>

        {/* Bootstrap Alert */}
        {alert.message && (
          <div className={`alert alert-${alert.type} text-center`} role="alert">
            {alert.message}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label text-dark">Email address</label>
          <input
            type="email"
            className="form-control rounded-pill"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label text-dark">Password</label>
          <input
            type="password"
            className="form-control rounded-pill"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          className="btn btn-primary fw-semibold w-100 shadow rounded-pill"
          onClick={handleLogin}
        >
          🔐 Login
        </button>
      </div>
    </div>
  );
}
