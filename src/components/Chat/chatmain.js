import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../config/firebaseconfig";

import { getDocs } from "firebase/firestore";

export const sendMessage = async (group, text) => {
  if (!text.trim()) return;

  const user = auth.currentUser;
  const senderName = user?.email || "Anonymous";

  await addDoc(collection(db, `groups/${group}/messages`), {
    text,
    senderName,
    timestamp: serverTimestamp(),
  });
};

export const subscribeToMessages = (group, callback) => {
  const q = query(collection(db, `groups/${group}/messages`), orderBy("timestamp"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  });
};


export const createGroup = async (groupName, imageUrl) => {
  
  await addDoc(collection(db, "groups"), {
    name: groupName,
    imageUrl: imageUrl || "",
    createdAt: serverTimestamp(),
  });
};

export const fetchGroups = async () => {
  const snapshot = await getDocs(collection(db, "groups"));
  return snapshot.docs.map((doc) => ({
    name: doc.data().name,
    imageUrl: doc.data().imageUrl || "",
  }));
}

