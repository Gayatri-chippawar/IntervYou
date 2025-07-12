import React from "react";
import Home from "./HomePage";

const Navbar = () => {
  return (
    <div className="position-relative w-100 overflow-hidden" style={{ height: '100vh' }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
        style={{ zIndex: -1 }}
      >
        <source src="/vdoo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Sticky Navbar */}
      <nav className="navbar navbar-expand-md bg-transparent px-4 py-3 fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Logo */}
          <div className="d-flex align-items-center gap-2">
            <img src="/logo.png" alt="Logo" style={{ width: "60px", height: "50px" }} />
            <span className="text-white fs-3 fw-semibold fst-italic">IntervYou</span>
          </div>

          {/* Nav Items */}
          <div className="bg-white px-4 py-3 rounded-pill d-flex align-items-center gap-4 shadow">
            <a href="#home" className="text-dark fw-semibold text-decoration-none">Home</a>
            <a href="#eligibility" className="text-dark fw-semibold text-decoration-none">Eligibility</a>
            <a href="#merits" className="text-dark fw-semibold text-decoration-none">Merits</a>
            <a href="#footer" className="text-dark fw-semibold text-decoration-none">Contact Us</a>
            <a href="/login" className="fw-bold text-decoration-none" style={{ color: '#6f42c1' }}>
              Login
            </a>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <div
        id="home"
        className="position-absolute top-50 start-50 translate-middle z-1"
        style={{ width: '100%' }}
      >
        <Home />
      </div>
    </div>
  );
};

export default Navbar;
