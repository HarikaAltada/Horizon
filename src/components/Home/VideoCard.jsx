import React from 'react';
import { Play } from 'lucide-react';
import './VideoCard.css';
import { climateChange } from '../../data/data';



const VideoCard = ({ video, onClick, className = '' }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  return (
     
    <div className="videos-main">
        
      <div className="thumbnail-container">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="thumbnail" 
        />
        <div className="overlay">
          <div className="play-icon">
            <Play className="play-svg" />
          </div>
        </div>
        <div className="duration-card-label">
          {video.duration}
        </div>
      </div>
      <div className="video-info-carousel">
        <h3 className="video-card-title">{video.title}</h3>
        <p className="video-card-meta">{video.author}</p>
      </div>
    </div>
     
  );
};

export default VideoCard;
