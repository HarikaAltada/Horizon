import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEnvelope, faArrowRight 
} from "@fortawesome/free-solid-svg-icons";
import { 
  faLinkedin, faTwitter, faInstagram, faYoutube, faFacebook, faGooglePlay, faApple 
} from "@fortawesome/free-brands-svg-icons";

import "./Footer.css"; // Import Custom CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        

        {/* Our Community */}
        <div className="footer-section">
          <h3>Our Community</h3>
          <ul>
            <li>Content</li>
            <li>Map</li>
            <li>Community Chat</li>
            <li>Action Hub</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section community">
          <h3>Newsletters</h3>
          <p>Get a daily email featuring the latest talk, plus a quick mix of trending content.</p>
          <div className="newsletter">
            <input type="email" placeholder="What's your email?" />
            <button className="subscribe">
              Subscribe
            </button>
          </div>
          <p className="small-text">
            By subscribing, you agree to our <a href="#">Privacy Policy</a>.
          </p>
        </div>

        {/* Membership & Social */}
        <div className="footer-section">
          <h3>Become a Horizon Member</h3>
          <p>Horizon Members help billions of people access inspiring ideas. Plus, they get exclusive benefits.</p>

          <h3>Follow TED</h3>
          <div className="social-icons">
            <FontAwesomeIcon icon={faLinkedin} />
            <FontAwesomeIcon icon={faTwitter} />
            <FontAwesomeIcon icon={faInstagram} />
             <FontAwesomeIcon icon={faEnvelope} />
            <FontAwesomeIcon icon={faFacebook} />
          </div>

        
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        
        <p>© Horizon Conferences, LLC. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
