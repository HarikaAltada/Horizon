import { db } from "../config/firebaseconfig"; // Your firebase config
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export const updateUserLocation = async (formData, states, countries) => {
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
      const selectedCountry = countries.find((c) => c.iso2 === formData.country);

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

      // Check if user exists
      const querySnapshot = await getDocs(
        query(collection(db, "mapPoints"), where("name", "==", formData.name))
      );

      if (!querySnapshot.empty) {
        const docRef = doc(db, "mapPoints", querySnapshot.docs[0].id);
        await updateDoc(docRef, newLocation);
        return "updated";
      } else {
        newLocation.createdAt = new Date();
        await addDoc(collection(db, "mapPoints"), newLocation);
        return "added";
      }
    } else {
      throw new Error("Could not geocode address");
    }
  } catch (error) {
    console.error("Error updating user location:", error);
    throw error;
  }
};
