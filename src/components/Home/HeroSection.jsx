import React from 'react';
import './HeroSection.css';
import Navbar from '../Navabar/Navbar';
import Footer from '../Footer/Footer';
import VideoSection from './VideoSection';
import HomePage from './HomePage';
const HeroSection = () => {
  return (
    <>
    <Navbar/>
    {/* <section className="hero-section">
      <div className="video-background">
        <video autoPlay loop muted playsInline className="background-video">
          <source
            src="https://tedconf.cdn.prismic.io/tedconf/ZgN05ccYqOFdyGhl_27RF.webm"
            type="video/webm"
          />
        </video>

        <div className="hero-overlay">
          <div className="hero-text-group">
            <span className="hero-title">Our Mission</span>
            <span className="hero-subtitle">
              Discover and spread ideas that spark conversation, deepen understanding, and drive meaningful change.
            </span>
          </div>
        </div>
      </div>
    </section> */}
    <VideoSection/>
    <HomePage/>
    <Footer/>
    </>
  );
};

export default HeroSection;
