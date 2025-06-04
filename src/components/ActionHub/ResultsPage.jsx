import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, ExternalLink } from "lucide-react";
import {
  passionCategories,
  PassionCategory,
} from "../../data/PassionCategories";
import "./ResultsPage.css";
import Navbar from "../Navabar/Navbar";
import Footer from "../Footer/Footer";
import Spinner from "../spinnner/spinner";
import { updateUserLocation } from "./FirebaseHelper";
const ResultsPage = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
    address: "",
  });
  const API_KEY = "YmZwQnNjSDNaZk5aTGFHOTNrR2RlMGxvMDFReEF0NUNGU1VvQVcyTw==";

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("https://api.countrystatecity.in/v1/countries", {
      headers: { "X-CSCAPI-KEY": API_KEY },
    })
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (location.country) {
      fetch(
        `https://api.countrystatecity.in/v1/countries/${location.country}/states`,
        {
          headers: { "X-CSCAPI-KEY": API_KEY },
        }
      )
        .then((res) => res.json())
        .then((data) => setStates(data))
        .catch((err) => console.error(err));
    }
  }, [location.country]);

  useEffect(() => {
    if (location.country && location.state) {
      fetch(
        `https://api.countrystatecity.in/v1/countries/${location.country}/states/${location.state}/cities`,
        {
          headers: { "X-CSCAPI-KEY": API_KEY },
        }
      )
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error(err));
    }
  }, [location.state]);
  const [passion, setPassion] = useState("");
  useEffect(() => {
    const storedCategories = sessionStorage.getItem("passionCategories");

    if (storedCategories) {
      try {
        const categoryIds = JSON.parse(storedCategories);
        const foundCategories = categoryIds
          .map((id) => passionCategories[id])
          .filter(Boolean);
        setTopCategories(foundCategories);

        // Combine all category names as a single comma-separated string
        const allPassions = foundCategories.map((cat) => cat.name).join(", ");
        setPassion(allPassions);
      } catch (error) {
        console.error("Error parsing stored categories:", error);
      }
    }

    if (!storedCategories) {
      window.location.href = "/quiz";
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleLocationSubmit = async (e) => {
     const storedUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
  const userName = storedUser.name || storedUser.displayName || storedUser.email || "Anonymous";
    e.preventDefault();
    try {
      // Compose formData-like object to pass
      const formData = {
        name: userName,  // get current user name here
        passion,
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
      };

      const result = await updateUserLocation(formData, states, countries);

      if (result === "added" || result === "updated") {
        sessionStorage.setItem("userLocation", JSON.stringify(location));
        setShowLocationPrompt(false);
        sessionStorage.setItem("userPassion", passion);
        navigate("/map");
      }
    } catch (err) {
      alert("Failed to update location. Please try again.");
    }
  };


  if (loading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="results-container">
        <div className="results-wrapper">
          <div className="results-header">
            <h1 className="results-title">Your Passion Results</h1>
            <p className="results-subtitle">
              Based on your responses, here are the areas that align with your
              interests and values.
            </p>
          </div>

          <div className="results-card">
            <div className="results-card-header">
              <h2>Your Top Passion Categories</h2>
            </div>

            <div className="results-card-body">
              <div className="categories-grid">
                {topCategories.map((category, index) => (
                  <div
                    key={category.id}
                    className="category-item fade-in-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="category-image-wrapper">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="category-image"
                      />
                    </div>
                    <h3 className="category-title">{category.name}</h3>
                    <p className="category-description">
                      {category.description}
                    </p>
                    <div className="sdg-tags">
                      {category.sdgs.map((sdg) => (
                        <span key={sdg} className="sdg-tag">
                          SDG {sdg}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="results-footer">
                <p>
                  These categories reflect areas where your passions and values
                  can make a meaningful impact. Explore our Action Hub to find
                  NGOs, funding opportunities, and learning resources related to
                  these interests.
                </p>

                <div className="results-actions">
                  <Link to="/action-hub" className="primary-btn">
                    Explore Action Hub <ArrowRight className="btn-icon" />
                  </Link>
                  <button
                    onClick={() => setShowLocationPrompt(true)}
                    className="connect-map-btn"
                  >
                    Connect with Others
                    <MapPin className="map-icon" />
                  </button>
                  <Link to="/quiz" className="secondary-btn">
                    Retake Questionnaire
                  </Link>
                </div>
                {showLocationPrompt && (
                  <div className="location-modal-backdrop">
                    <div className="location-modal-main">
                      <div className="location-modal-header">
                        <MapPin size={24} className="location-icon" />
                        <h3>Enter Your Location</h3>
                      </div>
                      <p className="location-modal-text">
                        To help you connect with like-minded people nearby,
                        please enter your location:
                      </p>
                      <form onSubmit={handleLocationSubmit}>
                        <div className="location-input-group">
                          <label htmlFor="country">Country</label>
                          <select
                            id="country"
                            value={location.country}
                            onChange={(e) =>
                              setLocation({
                                ...location,
                                country: e.target.value,
                                state: "",
                                city: "",
                              })
                            }
                            required
                          >
                            <option value="">Select Country</option>
                            {countries.map((c) => (
                              <option key={c.iso2} value={c.iso2}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="location-input-group">
                          <label htmlFor="state">State</label>
                          <select
                            id="state"
                            value={location.state}
                            onChange={(e) =>
                              setLocation({
                                ...location,
                                state: e.target.value,
                                city: "",
                              })
                            }
                            required
                          >
                            <option value="">Select State</option>
                            {states.map((s) => (
                              <option key={s.iso2} value={s.iso2}>
                                {s.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="location-input-group">
                          <label htmlFor="city">City</label>
                          <select
                            id="city"
                            value={location.city}
                            onChange={(e) =>
                              setLocation({ ...location, city: e.target.value })
                            }
                            required
                          >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                              <option key={city.id} value={city.name}>
                                {city.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="location-input-group">
                          <label htmlFor="address">Address</label>
                          <input
                            type="text"
                            id="address"
                            value={location.address}
                            onChange={(e) =>
                              setLocation({
                                ...location,
                                address: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="location-input-group">
                          <label htmlFor="passion">Your Passion</label>
                          <input
                            type="text"
                            id="passion"
                            value={passion}
                            readOnly
                            className="readonly-input"
                          />
                        </div>

                        <div className="location-modal-actions">
                          <button
                            type="button"
                            onClick={() => setShowLocationPrompt(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="location-primary-button"
                          >
                            Continue to Map
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="next-steps-box">
            <div className="next-steps-content">
              <div className="icon-box">
                <ExternalLink className="external-icon" />
              </div>
              <div>
                <h3 className="next-steps-title">What's Next?</h3>
                <p className="next-steps-text">
                  Visit our Action Hub to explore organizations, funding
                  opportunities, and learning resources related to your passion
                  areas. You can filter resources based on your interests to
                  find the perfect match for your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResultsPage;
