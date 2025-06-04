import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';
import './VideoCarousel.css';
import { Link } from 'react-router-dom';
const VideoCarousel = ({ videos, autoSlideInterval = 2000, onVideoClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  const maxIndex = Math.max(
    0,
    videos.length -
      (window.innerWidth >= 1024
        ? 4
        : window.innerWidth >= 768
        ? 3
        : 1)
  );

  useEffect(() => {
    if (!isPaused && videos.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
      }, autoSlideInterval);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused, videos.length, maxIndex, autoSlideInterval]);

  const handleNext = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
    setTimeout(() => setIsPaused(false), 2000);
  };

  const handlePrev = () => {
    setIsPaused(true);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
    setTimeout(() => setIsPaused(false), 2000);
  };

  const getTransform = () => {
    const itemWidth = carouselRef.current?.firstElementChild?.clientWidth || 0;
    const gap = 16;
    return `translateX(-${currentIndex * (itemWidth + gap)}px)`;
  };

  return (
    <div
      className="carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {videos.length > 0 && (
        <>
          <button
            onClick={handlePrev}
            className="nav-button-video left"
            aria-label="Previous video"
          >
            <ChevronLeft size={20} />
          </button>
          <Link to="content">
          <button
            onClick={handleNext}
            className="nav-button-video right"
            aria-label="Next video"
          >
            <ChevronRight size={20} />
          </button>
          </Link>
        </>
      )}

      <div className="carousel-track-container">
        <div
          className="carousel-track"
          ref={carouselRef}
          style={{
            transform: getTransform(),
            transition: 'transform 0.8s ease-in-out',
          }}
        >
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onVideoClick?.(video)}
            />
          ))}
        </div>
      </div>

      <div className="dots-container">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsPaused(true);
              setCurrentIndex(index);
              setTimeout(() => setIsPaused(false), 2000);
            }}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;
