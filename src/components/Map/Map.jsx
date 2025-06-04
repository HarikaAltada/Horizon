import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./Map.css";
import "leaflet/dist/leaflet.css";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebaseconfig";
import { useMap } from "react-leaflet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const FlyToLocation = ({ location, country }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      // Default zoom level for countries, which can be adjusted based on the country's size
      let zoomLevel = 11;

      // If country is selected, you could dynamically adjust the zoom level based on the country
      if (country) {
        zoomLevel = 10; // Example zoom level for country-wide view
      }

      map.flyTo([location.lat, location.lng], zoomLevel, {
        duration: 2,
      });
    } else {
      // Reset map to default position and zoom level
      map.flyTo([10.5937, 50.9629], 3.2, { duration: 2 }); // Example: default location (London) and zoom level 2
    }
  }, [location, country, map]);

  return null;
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const purpleIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const CustomMap = ({ userLocations = [], selectedLocation }) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const handleConnect = async (receiverName) => {
    try {
      const request = {
        sender: currentUser.name,
        receiver: receiverName,
        status: "pending",
        timestamp: new Date(),
      };
  
      const docRef = await addDoc(collection(db, "connectionRequests"), request);
      setSentRequests((prev) => [...prev, { ...request, id: docRef.id }]);
  
      toast.success(`Connection request sent to ${receiverName}`);
    } catch (error) {
      toast.error("Failed to send connection request.");
      console.error(error);
    }
  };
  
  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser?.name) return;

      const sentQuery = query(
        collection(db, "connectionRequests"),
        where("sender", "==", currentUser.name)
      );

      const receivedQuery = query(
        collection(db, "connectionRequests"),
        where("receiver", "==", currentUser.name)
      );

      const [sentSnap, receivedSnap] = await Promise.all([
        getDocs(sentQuery),
        getDocs(receivedQuery),
      ]);

      const sent = sentSnap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const received = receivedSnap.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setSentRequests(sent);
      setReceivedRequests(received);
    };

    fetchRequests();
  }, [currentUser]);

  const getRequestStatus = (otherUserName) => {
    const sent = sentRequests.find((r) => r.receiver === otherUserName);
    if (sent) return sent.status;

    const received = receivedRequests.find((r) => r.sender === otherUserName);
    if (received) return received.status;

    return null;
  };

  const getRequestId = (otherUserName, type = "received") => {
    const list = type === "sent" ? sentRequests : receivedRequests;
    const req = list.find(
      (r) => r.receiver === otherUserName || r.sender === otherUserName
    );
    return req?.id;
  };

  const handleCancelRequest = async (receiverName) => {
    try {
      const q = query(
        collection(db, "connectionRequests"),
        where("sender", "==", currentUser.name),
        where("receiver", "==", receiverName)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach(async (docSnap) => {
        await deleteDoc(doc(db, "connectionRequests", docSnap.id));
      });
  
      setSentRequests((prev) =>
        prev.filter((req) => req.receiver !== receiverName)
      );
  
      toast.info(`Connection request to ${receiverName} cancelled`);
    } catch (error) {
      toast.error("Failed to cancel request.");
      console.error(error);
    }
  };
  
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      <div className="map-legend">
        <div>
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png" />{" "}
          <span>You</span>
        </div>
        <div>
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" />{" "}
          <span>Connected</span>
        </div>
        <div>
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png" />{" "}
          <span>Pending Request</span>
        </div>
        <div>
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png" />{" "}
          <span>Not Connected</span>
        </div>
      </div>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToLocation location={selectedLocation} />
      {userLocations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={
            loc.name === currentUser.name
              ? purpleIcon
              : getRequestStatus(loc.name) === "accepted"
              ? greenIcon
              : getRequestStatus(loc.name) === "pending"
              ? orangeIcon
              : blueIcon
          }
        >
          <Popup>
            <strong>{loc.name}</strong>
            <br />
            <p>Passion: {loc.passion}</p>
            {currentUser?.name !== loc.name &&
              (() => {
                const status = getRequestStatus(loc.name);

                if (status === "pending") {
                  const isSender = sentRequests.some(
                    (r) => r.receiver === loc.name
                  );
                  return isSender ? (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelRequest(loc.name)}
                    >
                      Cancel Request
                    </button>
                  ) : (
                    <p style={{ color: "blue" }}>Accept Request</p>
                  );
                }

                if (status === "accepted") {
                  return <p style={{ color: "green" }}>Connected</p>;
                }

                return (
                  <button
                    className="book-btn"
                    onClick={() => handleConnect(loc.name)}
                  >
                    Connect
                  </button>
                );
              })()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CustomMap;
