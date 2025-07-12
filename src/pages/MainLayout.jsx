// src/layouts/MainLayout.jsx
import React from 'react';
import Navbar from './navbar';
import WhyChooseUs from './whytochooseus';
import WhoCanEnroll from './whocanenroll';
import Footer from './footer';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div id="merits">
        <WhyChooseUs />
        </div>
    <div id="eligibility">
    <WhoCanEnroll />
    </div>
      {children}
      <Footer />
    </>
  );


};

export default MainLayout;
