import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './UserProfile.css';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/api/auth/me');
        setUser(data);
      } catch {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) return <div className="text-center text-dark p-5">Loading profile...</div>;

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-warning bg-opacity-25" style={{ backgroundImage: 'url("/profile-bg.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="row w-100 justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg p-4" style={{ backgroundColor: '#fff7e6', borderRadius: '20px' }}>
            <div className="row">
              {/* Left Section */}
              <div className="col-md-4 text-center border-end">
                <div className="rounded-circle mx-auto d-flex align-items-center justify-content-center bg-warning text-white mb-3" style={{ width: '100px', height: '100px', fontSize: '36px' }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <h4>{user.name || 'Unnamed User'}</h4>
                <p className="text-muted mb-1">{user.email}</p>
                <p className={user.verified ? 'text-success' : 'text-danger'}>
                  {user.verified ? '✅ Verified User' : '❌ Not Verified'}
                </p>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline-secondary mt-3">
                  ⬅ Back to Dashboard
                </button>
              </div>

              {/* Right Section */}
              <div className="col-md-8">
                <h4 className="fw-bold mb-3">Profile Details</h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item bg-transparent"><strong>Full Name:</strong> {user.name}</li>
                  <li className="list-group-item bg-transparent"><strong>Email:</strong> {user.email}</li>
                  <li className="list-group-item bg-transparent"><strong>User ID:</strong> {user._id}</li>
                  <li className="list-group-item bg-transparent"><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleString()}</li>
                  <li className="list-group-item bg-transparent"><strong>Status:</strong> {user.verified ? 'Verified' : 'Unverified'}</li>
                </ul>

                <button className="btn btn-danger mt-4" onClick={handleLogout}>
                  🔓 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
