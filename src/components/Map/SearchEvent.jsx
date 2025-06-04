import { useState, useEffect } from "react";
import ListingCard from "./EventList";
import CustomMap from "./Map";
import "./SearchEvent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { db } from "../config/firebaseconfig"; // adjust the path
import { collection, addDoc, getDocsdoc,getDocs, doc,updateDoc, query, where } from "firebase/firestore";
import { toast } from "react-toastify";
import Navabar from "../Navabar/Navbar";

const SearchEvent = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [userLocations, setUserLocations] = useState([]);
  // const [searchPassion, setSearchPassion] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    passion: "",
    address: "",
    country: "",
    state: "",
    city: "",
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const API_KEY = "YmZwQnNjSDNaZk5aTGFHOTNrR2RlMGxvMDFReEF0NUNGU1VvQVcyTw=="; // Replace this with your Country-State-City API key
const storedPassion = sessionStorage.getItem("userPassion") || "";
const [searchPassion, setSearchPassion] = useState(storedPassion|| "");
  useEffect(() => {
    fetch("https://api.countrystatecity.in/v1/countries", {
      headers: { "X-CSCAPI-KEY": API_KEY },
    })
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetch(
        `https://api.countrystatecity.in/v1/countries/${formData.country}/states`,
        {
          headers: { "X-CSCAPI-KEY": API_KEY },
        }
      )
        .then((res) => res.json())
        .then((data) => setStates(data))
        .catch((err) => console.error(err));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.country && formData.state) {
      fetch(
        `https://api.countrystatecity.in/v1/countries/${formData.country}/states/${formData.state}/cities`,
        {
          headers: { "X-CSCAPI-KEY": API_KEY },
        }
      )
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error(err));
    }
  }, [formData.state]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        const countryNames = data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryNames);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Reset dependent fields
    if (e.target.name === "country") {
      setFormData((prev) => ({ ...prev, state: "", city: "" }));
      setStates([]);
      setCities([]);
    } else if (e.target.name === "state") {
      setFormData((prev) => ({ ...prev, city: "" }));
      setCities([]);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "mapPoints"));
        const locations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserLocations(locations);
      } catch (err) {
        console.error("Error fetching locations from Firebase:", err);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser?.name) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name,
      }));
    }
  }, []);



  const handleSubmit = async () => {
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country}`;
      let res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          fullAddress
        )}`
      );
      let data = await res.json();
  
      if (data.length === 0 && formData.city && formData.state) {
        const fallbackAddress = `${formData.city}, ${formData.state}, ${formData.country}`;
        res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fallbackAddress
          )}`
        );
        data = await res.json();
      }
  
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const selectedState = states.find((s) => s.iso2 === formData.state);
        const selectedCountry = countries.find(
          (c) => c.iso2 === formData.country
        );
  
        const newLocation = {
          name: formData.name,
          passion: formData.passion,
          city: formData.city,
          state: selectedState?.name || formData.state,
          country: selectedCountry?.name || formData.country,
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          updatedAt: new Date(),
        };
  
        // Check if the user already has a location
        const querySnapshot = await getDocs(
          query(collection(db, "mapPoints"), where("name", "==", formData.name))
        );
  
        if (!querySnapshot.empty) {
          // Update existing profile
          const docRef = doc(db, "mapPoints", querySnapshot.docs[0].id);
          await updateDoc(docRef, newLocation);
          toast.success("Profile updated!");
        } else {
          // Add new profile
          newLocation.createdAt = new Date();
          await addDoc(collection(db, "mapPoints"), newLocation);
          toast.success("Profile added!");
        }
  
        // Refresh local state
        const allLocations = await getDocs(collection(db, "mapPoints"));
        const updatedLocations = allLocations.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserLocations(updatedLocations);
  
        setShowPopup(false);
      } else {
        alert(
          "Could not find any nearby location. Please try a more general address."
        );
      }
    } catch (err) {
      console.error("Geocoding or Firebase error:", err);
    }
  };
  
  useEffect(() => {
    if (searchPassion.trim() === "") {
      // Reload all markers
      const fetchAll = async () => {
        const snapshot = await getDocs(collection(db, "mapPoints"));
        const all = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserLocations(all);
        setSelectedLocation(null);
      };
      fetchAll();
    }
  }, [searchPassion]);

  const handleSearch = async () => {
    if (!searchPassion) {
      toast.error("Please enter a passion.");
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const querySnapshot = await getDocs(collection(db, "mapPoints"));
    const allUsers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const requestsSnapshot = await getDocs(
      collection(db, "connectionRequests")
    );
    const connections = requestsSnapshot.docs
      .map((doc) => doc.data())
      .filter(
        (req) =>
          req.status === "accepted" &&
          (req.sender === currentUser.name || req.receiver === currentUser.name)
      );

    const connectedNames = new Set(
      connections.map((conn) =>
        conn.sender === currentUser.name ? conn.receiver : conn.sender
      )
    );

    // Filter users based on passion and country (if provided)
    const filteredByPassion = allUsers.filter(
      (user) =>
        user.passion.toLowerCase().includes(searchPassion.toLowerCase()) &&
        user.name !== currentUser.name
    );

    const filteredByCountryAndPassion = selectedCountry
      ? filteredByPassion.filter(
          (user) =>
            user.country?.toLowerCase() === selectedCountry.toLowerCase()
        )
      : filteredByPassion;

    if (filteredByCountryAndPassion.length > 0) {
      const firstLocation = filteredByCountryAndPassion[0];
      setUserLocations(filteredByCountryAndPassion);
      setSelectedLocation({ lat: firstLocation.lat, lng: firstLocation.lng });
      setSelectedCountry(selectedCountry); // Ensure country is passed to map
    }

    const unconnected = filteredByCountryAndPassion.filter(
      (user) => !connectedNames.has(user.name)
    );

    if (unconnected.length > 0) {
      setUserLocations(unconnected);
      setSelectedLocation({ lat: unconnected[0].lat, lng: unconnected[0].lng });
      return;
    }

    const connected = filteredByCountryAndPassion.filter((user) =>
      connectedNames.has(user.name)
    );

    if (connected.length > 0) {
      toast.info(
        "You're already connected with people who share this passion."
      );
      setSelectedLocation({ lat: connected[0].lat, lng: connected[0].lng });
      return;
    }

    toast.info("No users found with that passion in selected country.");
  };

  return (
    <>
      <Navabar />
      <div className="map-container">
        <div className="left-panel">
          <div className="passion-details">
            <h2>
            Discover People by Passion
            </h2>
            <button className="btn-passion" onClick={() => setShowPopup(true)}>
              <FontAwesomeIcon icon={faPlus} className="icon-plus" /> Passion
            </button>
          </div>

          <div className="filters">
            <input
              placeholder="Passion/Interest"
              value={searchPassion}
              onChange={(e) => setSearchPassion(e.target.value)}
            />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country.iso2} value={country.name}>
                  {country.name} {country.emoji}
                </option>
              ))}
            </select>
          </div>

          <div className="center-button">
            <span
              className="btn-default btn-default-red load-post-container"
              onClick={handleSearch}
            >
              Search
            </span>
          </div>

          <ListingCard userLocations={userLocations} searchPassion={searchPassion} onUserSelect={setSelectedLocation} />
        </div>

        <div className="right-panel">
          <CustomMap
            userLocations={userLocations}
            selectedLocation={selectedLocation}
            country={selectedCountry}
          />
        </div>

        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-modal">
              <FontAwesomeIcon
                icon={faTimes}
                className="close-icon"
                onClick={() => setShowPopup(false)}
              />
              <h3>Enter Passion Details</h3>
              <input
                type="text"
                name="passion"
                placeholder="Your Passion"
                value={formData.passion}
                onChange={handleInputChange}
              />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.iso2} value={country.iso2}>
                    {country.name}
                  </option>
                ))}
              </select>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.iso2} value={state.iso2}>
                    {state.name}
                  </option>
                ))}
              </select>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>

              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default SearchEvent;
