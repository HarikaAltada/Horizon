import React from "react";
import "./VideoModal.css";

const VideoModal = ({ videoUrl, onClose }) => {
  if (!videoUrl) return null;

  return (
    <div className="video-modal" onClick={onClose}>
      
        <div className="video-modal-content" onClick={onClose}>
        <button className="close-btn-content" onClick={onClose}>✖</button>
                    <div
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="close-button" onClick={onClose}>
                        &times;
                      </span>
                      <iframe
                        width="700"
                        height="400"
                        src={videoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
   
    </div>
  );
};

export default VideoModal;
