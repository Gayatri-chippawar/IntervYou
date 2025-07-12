import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // ✅ Add this


export default function DocumentUpload() {
  const [user, setUser] = useState(null);
  const [degree, setDegree] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate(); // ✅ Add this too


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: me }, { data: myDocs }] = await Promise.all([
          api.get('/api/auth/me'),
          api.get('/api/document/my')
        ]);
        setUser(me);
        setDocuments(myDocs);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };
    fetchData();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: '', message: '' }), 4000);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file || !degree || !fatherName) {
      showAlert('danger', 'All fields are required.');
      return;
    }

    if (file.type !== 'application/pdf') {
      showAlert('danger', 'Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showAlert('danger', 'File size must be less than 10MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', 'Degree Certificate');
      formData.append('metaJson', JSON.stringify({ degree, fatherName }));

      const { data } = await api.post('/api/document/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setDocuments(prev => [data.document, ...prev]);
      setDegree('');
      setFatherName('');
      setFile(null);
      showAlert('success', 'Document uploaded successfully!');
    } catch (err) {
      console.error('Upload failed:', err);
      showAlert('danger', err.response?.data?.error || 'Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  // ✅ Determine latest document and showForm condition
  const latestDoc = documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const showForm = !latestDoc || latestDoc.status === 'REJECTED';

  return (
<div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-5">
      <div className="row w-100">
        <div className="col-md-6">

          
  <button
    className="btn px-3 py-2 mb-4"
    style={{
      backgroundColor: '#facc15', // Yellow background
      color: '#000',              // Black text
      fontWeight: '600',
      border: 'none',
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    }}
    onClick={() => navigate('/dashboard')}
  >
    ← Back
  </button>

          <h2 className="mb-4 fw-bold text-purple">Upload Document</h2>


          {/* ✅ Bootstrap Alert */}
          {alert.message && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
            </div>
          )}

          {/* ✅ Status-Based Alerts */}
          {latestDoc?.status === 'APPROVED' && (
            <div className="alert alert-success">
              ✅ Your document has already been <strong>verified</strong>.
            </div>
          )}

          {latestDoc?.status === 'PENDING' && (
            <div className="alert alert-warning">
              ⏳ Your document is under <strong>review</strong>. You will be notified once it's verified.
            </div>
          )}

          {/* ✅ Upload Form - Only when allowed */}
          {showForm && user && (
            <form onSubmit={handleUpload} className="w-100">
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" value={user.name} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={user.email} readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Father's Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Degree Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Upload Certificate (PDF Only)</label>
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
                <small className="text-muted">Max 10MB, PDF only</small>
              </div>

              <button
              type="submit"
              className="btn px-4 py-2"
              style={{
                backgroundColor: '#facc15', // Tailwind yellow-400
                color: '#000',              // Black text
                border: 'none',
                fontWeight: '600',          // Semi-bold (or use 'bold' for full bold)
              }}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Submit Document'}
            </button>


            </form>
          )}

          {/* ✅ Show uploaded document(s) */}
          <div className="mt-5">
            <h3 className="mb-3">Your Documents</h3>
            {documents.length > 0 ? (
              <div className="list-group">
                {documents.map((doc) => (
                  <div key={doc._id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6>{doc.docType}</h6>
                        <small className="text-muted">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </small>
                        <span className={`badge ms-2 ${
                          doc.status === 'APPROVED' ? 'bg-success' :
                          doc.status === 'REJECTED' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No documents uploaded yet.</p>
            )}
          </div>
        </div>

        <div className="col-md-6 text-center d-none d-md-block">
          <img
            src="/Documents.svg"
            alt="Upload Illustration"
            className="img-fluid"
            style={{ maxHeight: '500px' }}
          />
        </div>
      </div>
    </div>
    
  );
}
