import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './Footer.css'; // Optional: Add extra styling if needed

const Footer = () => {
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    // You can later trigger this with a secret click/keystroke
    navigate('/admin-login');
  };

  return (
    <footer id="footer" className="bg-light py-5 mt-5 position-relative" style={{ boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)' }}>
      <div className="container">
        <div className="row gy-4">

          {/* About Us */}
          <div className="col-md-6 col-lg-3">
            <h5 className="fw-semibold mb-3 text-dark">About Us</h5>
            <p className="text-muted small">
              We provide mock interviews to help you succeed by building confidence through realistic practice.
            </p>
          </div>

          {/* Contact Us */}
          <div className="col-md-6 col-lg-3">
  <h5 className="fw-semibold mb-3 text-dark">Contact Us</h5>
  <ul className="list-unstyled small text-muted">
    <li>
      Email: <a href="mailto:support@company.com" className="text-decoration-none text-primary">support@company.com</a>
    </li>
    <li>
      Phone: <a href="tel:123-456-7890" className="text-decoration-none text-primary">123-456-7890</a>
    </li>
    <li>Address: 123, Some Street, City</li>
  </ul>
</div>


          {/* Quick Links */}
          <div className="col-md-6 col-lg-3">
            <h5 className="fw-semibold mb-3 text-dark">Quick Links</h5>
            <ul className="list-unstyled small">
              <li><a href="/about" className="text-decoration-none text-secondary">About Us</a></li>
              <li><a href="/faq" className="text-decoration-none text-secondary">FAQ</a></li>
              <li><a href="/careers" className="text-decoration-none text-secondary">Careers</a></li>
              <li><a href="/terms" className="text-decoration-none text-secondary">Terms & Conditions</a></li>
              <li><a href="/privacy" className="text-decoration-none text-secondary">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Connect + Hidden Admin */}
          <div className="col-md-6 col-lg-3 d-flex flex-column justify-content-between">
            <div>
              <h5 className="fw-semibold mb-3 text-dark">Connect with Us</h5>
              <div className="mb-3">
                <a href="https://facebook.com" className="me-3 text-secondary text-decoration-none">Facebook</a>
                <a href="https://twitter.com" className="me-3 text-secondary text-decoration-none">Twitter</a>
                <a href="https://linkedin.com" className="text-secondary text-decoration-none">LinkedIn</a>
              </div>
            </div>

            {/* 🕵️ Hidden Admin Button */}
            <button
              className="position-absolute"
              style={{
                bottom: '10px',
                right: '10px',
                opacity: 0,
                pointerEvents: 'auto',
                width: '40px',
                height: '40px',
              }}
              onClick={handleAdminAccess}
              aria-label="Hidden Admin Button"
              title="Admin"
            >
              {/* Invisible Access Point */}
            </button>
          </div>
        </div>

        <div className="text-center pt-4 border-top mt-4" style={{ borderTop: '2px solid #fdd835' }}>
          <p className="text-muted small mb-0">&copy; 2025 IntervYou. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
