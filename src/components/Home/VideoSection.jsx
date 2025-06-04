import React, { useState } from 'react';
import VideoCarousel from './VideoCarousel';
import VideoCard from './VideoCard';
import { featuredVideos, additionalVideos } from './Videos';
import { ArrowRight } from 'lucide-react';
import './VideoSection.css';
import { Link } from 'react-router-dom';
const VideoSection = () => {
  const [activeVideo, setActiveVideo] = useState(featuredVideos[0]);

  return (
    <div className="video-section">

      {/* Hero Video Section */}
      <div className="hero-container">
        <div className="video-background">
          <video autoPlay loop muted playsInline className="background-video">
          <source
            src="https://tedconf.cdn.prismic.io/tedconf/ZgN05ccYqOFdyGhl_27RF.webm"
            type="video/webm"
          />
          </video>
          <div className="hero-overlay" />
        </div>
        
        <div className="hero-content-wrapper">
          <div className="hero-content">
            <div className='hero-text-group'>
            <h1 className="hero-title">Empower,Connect Make an Impact.</h1>
            <p className="hero-description">Discover what inspires you, explore opportunities that align with your goals, and connect with a vibrant community of changemakers working toward real-world solutions.</p>
            </div>
            <Link to="quiz">
            <button className="hero-button">
              <span>Find Your Passion</span>
               <ArrowRight className="icon-small" />
            </button>
          </Link>
            <div className="carousel-wrapper">
              <VideoCarousel 
                videos={featuredVideos} 
                onVideoClick={(video) => setActiveVideo(video)}
                autoSlideInterval={1800}
              />
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default VideoSection;
