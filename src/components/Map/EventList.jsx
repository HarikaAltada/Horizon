import React, { useState, useEffect } from "react";
import "./EventList.css";
import { db } from "../config/firebaseconfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  doc,
  setDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { Users, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUsers,
  faComments,
  faBell,
  faUser,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { formatLastMessageTime } from "../../utils/helper";
import Spinner from "../spinnner/spinner";

const ListingCard = ({ userLocations, searchPassion,onUserSelect }) => {
  const tabs = [
    { name: "Connection", icon: faUsers },
    { name: "Chat", icon: faComments },
    { name: "Notification", icon: faBell },
    { name: "Profile", icon: faUser },
  ];
  const [activeTab, setActiveTab] = useState("Connection");
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [unseenNotificationCount, setUnseenNotificationCount] = useState(0);
  const [connections, setConnections] = useState([]);

  const [filteredConnections, setFilteredConnections] = useState([]);

  const sendMessage = async () => {
    if (!message.trim() || !selectedChatUser) return;

    const chatId = [currentUser.name, selectedChatUser.name].sort().join("_");

    await addDoc(collection(db, "messages"), {
      chatId,
      sender: currentUser.name,
      receiver: selectedChatUser.name,
      content: message.trim(),
      timestamp: new Date().toISOString(),
      seen: false,
    });

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: message.trim(),
      updatedAt: new Date(),
    });
    setMessage("");
  };

  useEffect(() => {
    if (!selectedChatUser) return;
    setMessages([]);
    const chatId = [currentUser.name, selectedChatUser.name].sort().join("_");

    const q = query(collection(db, "messages"), where("chatId", "==", chatId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(
        msgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      );
    });

    return () => unsubscribe();
  }, [selectedChatUser]);

  const handleAccept = async (notif) => {
    await updateDoc(doc(db, "connectionRequests", notif.id), {
      status: "accepted",
    });

    const otherUser = notif.sender;
    const chatId = [currentUser.name, otherUser].sort().join("_"); // unique ID for chat

    await setDoc(doc(db, "chats", chatId), {
      users: [currentUser.name, otherUser],
      lastMessage: "",
      updatedAt: new Date(),
    });

    // Notify current user (receiver)
    await addDoc(collection(db, "notifications"), {
      type: "connection",
      sender: notif.sender,
      receiver: currentUser.name,
      message: `You accepted ${otherUser}'s request.`,
      status: "accepted",
      timestamp: new Date(),
      seen: false,
    });

    // Notify sender (the one who sent the original request)
    await addDoc(collection(db, "notifications"), {
      type: "connection",
      sender: currentUser.name,
      receiver: otherUser,
      message: `${currentUser.name || ""} accepted your request.`,
      status: "accepted",
      timestamp: new Date(),
      seen: false,
    });

    // Add to local chat list if not already there
    setChatUsers((prev) => {
      const exists = prev.some((user) => user.name === otherUser);
      if (!exists) {
        return [
          ...prev,
          { name: otherUser, avatar: otherUser.charAt(0).toUpperCase() },
        ];
      }
      return prev;
    });
    setSelectedChatUser({
      name: otherUser,
      avatar: otherUser.charAt(0).toUpperCase(),
    });
    setActiveTab("Chat");
  };

  useEffect(() => {
    const fetchChats = async () => {
      setLoadingChat(true);
      const q = query(
        collection(db, "chats"),
        where("users", "array-contains", currentUser?.name)
      );
      const chatList = [];
      const snapshot = await getDocs(q);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherUser = data.users.find((u) => u !== currentUser.name);
        const chatId = [currentUser.name, otherUser].sort().join("_");

        // Get unread count
        const messagesQuery = query(
          collection(db, "messages"),
          where("chatId", "==", chatId),
          where("receiver", "==", currentUser.name),
          where("seen", "==", false)
        );
        const messagesSnap = await getDocs(messagesQuery);
        const unreadCount = messagesSnap.size;

        // Get the last message and its timestamp
        const lastMsgQuery = query(
          collection(db, "messages"),
          where("chatId", "==", chatId)
        );
        const allMessagesSnap = await getDocs(lastMsgQuery);
        const allMsgs = allMessagesSnap.docs.map((doc) => doc.data());
        const sortedMsgs = allMsgs.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        const lastMessage = sortedMsgs[0]?.content || "";
        const lastMessageTime = data.updatedAt?.toDate?.() || null;

        chatList.push({
          name: otherUser,
          avatar: otherUser.charAt(0).toUpperCase(),
          unreadCount: unreadCount > 0 ? unreadCount : null,
          lastMessage: lastMessage,
          lastMessageTime: formatLastMessageTime(lastMessageTime),
        });
      }

      setChatUsers(chatList);
      setLoadingChat(false);
    };

    if (activeTab === "Chat" && currentUser?.name) {
      fetchChats();
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    if (!currentUser?.name) return;

    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser.name)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const otherUser = data.users.find((u) => u !== currentUser.name);
          const chatId = [currentUser.name, otherUser].sort().join("_");

          const messagesQuery = query(
            collection(db, "messages"),
            where("chatId", "==", chatId),
            where("receiver", "==", currentUser.name),
            where("seen", "==", false)
          );
          const messagesSnap = await getDocs(messagesQuery);
          const unreadCount = messagesSnap.size;

          return {
            name: otherUser,
            avatar: otherUser.charAt(0).toUpperCase(),
            unreadCount: unreadCount > 0 ? unreadCount : null,
            lastMessage: data.lastMessage || "",
            lastMessageTime: formatLastMessageTime(
              data.updatedAt?.toDate?.() || data.updatedAt
            ),
          };
        })
      );

      setChatUsers(chatList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.name) return;

    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", currentUser.name)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const otherUser = data.users.find((u) => u !== currentUser.name);

          const chatId = [currentUser.name, otherUser].sort().join("_");
          const messagesQuery = query(
            collection(db, "messages"),
            where("chatId", "==", chatId),
            where("receiver", "==", currentUser.name),
            where("seen", "==", false)
          );
          const messagesSnap = await getDocs(messagesQuery);
          const unreadCount = messagesSnap.size;

          return {
            name: otherUser,
            avatar: otherUser.charAt(0).toUpperCase(),
            unreadCount: unreadCount > 0 ? unreadCount : null,
            lastMessage: data.lastMessage || "",
            lastMessageTime: formatLastMessageTime(
              data.updatedAt?.toDate?.() || data.updatedAt
            ),
          };
        })
      );

      setChatUsers(chatList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const fetchAllNotifications = async () => {
      if (!currentUser?.name) return;
      setLoadingNotifications(true);

      // ✅ Fetch pending connection requests
      const reqQuery = query(
        collection(db, "connectionRequests"),
        where("receiver", "==", currentUser.name),
        where("status", "==", "pending")
      );
      const reqSnap = await getDocs(reqQuery);
      const pendingRequests = reqSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Fetch unseen general notifications
      const notifQuery = query(
        collection(db, "notifications"),
        where("receiver", "==", currentUser.name)
      );
      const notifSnap = await getDocs(notifQuery);
      const allNotifs = notifSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const unseenNotifs = allNotifs.filter((n) => !n.seen);

      // ✅ Total unseen = unseen normal notifications + connection requests
      setUnseenNotificationCount(unseenNotifs.length + pendingRequests.length);

      const allNotifications = [...pendingRequests, ...allNotifs].map((n) => ({
        ...n,
        timestamp: n.timestamp?.toDate?.() || new Date(n.timestamp),
      }));

      // 🔁 Sort descending (latest first)
      allNotifications.sort((a, b) => b.timestamp - a.timestamp);

      setNotifications(allNotifications);

      setLoadingNotifications(false);
    };

    const markNotificationsSeen = async () => {
      if (activeTab === "Notification" && currentUser?.name) {
        const unseenNotifQuery = query(
          collection(db, "notifications"),
          where("receiver", "==", currentUser.name),
          where("seen", "==", false)
        );
        const snap = await getDocs(unseenNotifQuery);

        const promises = snap.docs.map((docSnap) =>
          updateDoc(doc(db, "notifications", docSnap.id), {
            seen: true,
          })
        );

        await Promise.all(promises);

        // ✅ Immediately update local unseen count to 0
        setUnseenNotificationCount(0);
      }
    };

    fetchAllNotifications();

    // ✅ Only mark 'notifications' (not connectionRequests) as seen
    if (activeTab === "Notification") {
      markNotificationsSeen();
    }
  }, [activeTab, currentUser]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser?.name) {
        const querySnapshot = await getDocs(collection(db, "requests"));
        const userRequests = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter(
            (req) =>
              req.receiver === currentUser.name && req.status === "pending"
          );

        setRequests(userRequests);
      }
    };

    fetchRequests();
  }, [currentUser]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

  const currentUserData = userLocations.filter(
    (user) => user.name === currentUser?.name
  );

  const handleDeny = async (notif) => {
    await updateDoc(doc(db, "connectionRequests", notif.id), {
      status: "denied",
    });

    // Optionally notify sender
    await addDoc(collection(db, "notifications"), {
      type: "connection",
      sender: currentUser.name,
      receiver: notif.sender,
      message: `${currentUser.name || ""} denied your request.`,
      status: "denied",
      timestamp: new Date(),
    });

    // Remove the denied request from local state
    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
  };
  const customLocale = {
    ...enUS,
    formatDistance: (token, count, options) => {
      return enUS
        .formatDistance(token, count, {
          ...options,
          addSuffix: true,
          includeSeconds: options?.includeSeconds,
          comparison: 0,
        })
        .replace("about ", ""); // remove "about"
    },
  };
  const handleChatClick = async (user) => {
    setSelectedChatUser(user);

    // Set unread count to null for the clicked user locally
    setChatUsers((prev) =>
      prev.map((chatUser) =>
        chatUser.name === user.name
          ? { ...chatUser, unreadCount: null }
          : chatUser
      )
    );

    // Mark messages as seen in Firestore
    const chatId = [currentUser.name, user.name].sort().join("_");

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      where("receiver", "==", currentUser.name),
      where("seen", "==", false)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await updateDoc(doc.ref, { seen: true });
    });
  };

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const snapshot = await getDocs(collection(db, "mapPoints"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConnections(data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };

    if (activeTab === "Connection") {
      fetchConnections();
    }
  }, [activeTab]);

  // 🔍 Filter connections based on passion
  useEffect(() => {
    if (searchPassion.trim() === "") {
      setFilteredConnections(connections); // Show all if no passion is entered
    } else {
      const filtered = connections.filter((user) =>
        user.passion?.toLowerCase().includes(searchPassion.toLowerCase())
      );
      setFilteredConnections(filtered);
    }
  }, [searchPassion, connections]);

  return (
    <div className="tabs-container-chat">
      {/* Tabs */}
      <div className="tab-header">
        {tabs.map((tab) => {
          return (
            <div
              key={tab.name}
              className={`tab-items ${activeTab === tab.name ? "active" : ""}`}
              onClick={() => setActiveTab(tab.name)}
            >
              <FontAwesomeIcon icon={tab.icon} className="tab-icon" />
              {tab.name}
              {tab.name === "Notification" && unseenNotificationCount > 0 && (
                <span className="notification-badge">
                  {unseenNotificationCount}
                </span>
              )}
            </div>
          );
        })}
      </div>
      {/* Tab Content */}
      <div className="tabs-main">
        <div className="tab-content">
          {activeTab === "Connection" && (
            <div className="nearby-connections">
              {searchPassion.trim() === "" ? (
                <div className="no-chats">
                  <FontAwesomeIcon icon={faUsers} className="chats-tab-icon" />
                  <p>Search for a passion to see connections.</p>
                </div>
              ) : (
                <div className="user-list">
                  {filteredConnections.length > 0 ? (
                    filteredConnections.map((user) => (
                      <div
                        className="user-card"
                        key={user.id}
                        onClick={() =>
                          onUserSelect({
                            lat: user.lat,
                            lng: user.lng,
                            name: user.name,
                          })
                        }
                      >
                        <div className="user-info">
                          <div className="user-avatar">
                            <Users className="user-icon" />
                          </div>
                          <div className="user-details-connections">
                            <h3 className="user-name-connection">
                              {user.name}
                            </h3>
                            <p className="user-location">
                              {user.city}, {user.state}, {user.country}
                            </p>
                            <div className="user-passions">
                              <span className="passion-badge">
                                {user.passion}
                              </span>
                            </div>
                            {/* <button className="connect-button">
                              <MessageSquare className="connect-icon" />
                              Connect
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-chats">
                      <FontAwesomeIcon
                        icon={faUsers}
                        className="chats-tab-icon"
                      />
                      <p>No connections found for this passion.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {/*Profile Tab*/}
        <div className="tab-content">
          {activeTab === "Profile" && (
            <div className="profile-tab">
              {currentUserData.length === 0 ? (
                <div className="no-chats">
                  <FontAwesomeIcon icon={faUser} className="chats-tab-icon" />
                  <p>No profile details found for current user.</p>
                </div>
              ) : (
                currentUserData.map((user, index) => (
                  <div key={user.id || index} className="profile-card">
                    <div class="profile-header">
                      <h3 class="profile-title">User Profile</h3>
                      <p class="profile-description">
                        This is some information about the user.
                      </p>
                    </div>
                    <div class="profile-content">
                      <div class="profile-details">
                        <div class="profile-row">
                          <dt class="profile-label">Full name</dt>
                          <dd class="profile-value">{user.name}</dd>
                        </div>
                        <div class="profile-row">
                          <dt class="profile-label">Passion</dt>
                          <dd class="profile-value">{user.passion}</dd>
                        </div>
                        <div class="profile-row">
                          <dt class="profile-label">City</dt>
                          <dd class="profile-value">{user.city}</dd>
                        </div>
                        <div class="profile-row">
                          <dt class="profile-label">State</dt>
                          <dd class="profile-value">{user.state}</dd>
                        </div>
                        <div class="profile-row">
                          <dt class="profile-label">Country</dt>
                          <dd class="profile-value">{user.country}</dd>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {activeTab === "Notification" &&
          (loadingNotifications ? (
            <Spinner />
          ) : (
            <div className="notification-tab">
              {notifications.length === 0 ? (
                <div className="no-chats">
                  <FontAwesomeIcon icon={faBell} className="chats-tab-icon" />
                  <p>No new requests</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div key={notif.id} className="notification-card">
                    <div className="notification-header">
                      <div className="avatar">
                        {(notif.status === "accepted"
                          ? notif.receiver || "" === currentUser.name || ""
                            ? notif.sender || ""
                            : notif.receiver || ""
                          : notif.sender || ""
                        )
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        {notif.status === "pending" && (
                          <div>
                            <p>
                              <strong>
                                {notif.message ||
                                  `${notif.sender} wants to connect with you.`}
                              </strong>
                            </p>
                            <div className="action-buttons">
                              <button
                                className="accept-btn"
                                onClick={() => handleAccept(notif)}
                              >
                                Accept
                              </button>
                              <button
                                className="deny-btn"
                                onClick={() => handleDeny(notif)}
                              >
                                Deny
                              </button>
                            </div>
                          </div>
                        )}
                        <div className="notification-content">
                          {/* <strong>{notif.sender}</strong> */}
                          <p>{notif.message}</p>
                        </div>
                        <div className="timestamp">
                          {notif.timestamp
                            ? formatDistanceToNow(
                                notif.timestamp.toDate
                                  ? notif.timestamp.toDate()
                                  : new Date(notif.timestamp),
                                { addSuffix: true, locale: customLocale }
                              )
                            : "Just now"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        {activeTab === "Chat" &&
          (loadingChat ? (
            <Spinner />
          ) : (
            <div className="chat-tab">
              {chatUsers.length === 0 ? (
                <div className="no-chats">
                  <FontAwesomeIcon
                    icon={faComments}
                    className="chats-tab-icon"
                  />
                  <p>No active chats</p>
                </div>
              ) : (
                chatUsers.map((user, index) => (
                  <div
                    key={index}
                    className="chat-card"
                    onClick={() => handleChatClick(user)}
                  >
                    <div className="profile-name">
                      <div className="avatar">{user.avatar}</div>
                      <span className="name">
                        {user.name.replace(/^\w/, (c) => c.toUpperCase())}
                        <p className="chat-last-message">{user.lastMessage}</p>
                      </span>
                    </div>
                    <div className="profile-count">
                      <span className="last-message-time">
                        {user.lastMessageTime}
                      </span>
                      {user.unreadCount > 0 && (
                        <div className="unread-badge">{user.unreadCount}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        {selectedChatUser && (
          <div className="chat-panel">
            <div className="chat-main">
              <span
                className="back-button"
                onClick={() => setSelectedChatUser(null)}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </span>
              <div className="avatar">{selectedChatUser.avatar}</div>
              <h4>
                {selectedChatUser.name.replace(/^\w/, (c) => c.toUpperCase())}
              </h4>
            </div>
            <div className="chat-body">
              {messages.map((msg, idx) => {
                const isSent = msg.sender === currentUser?.name;
                const senderInitial = msg.sender.charAt(0).toUpperCase();

                // Format time (you can customize this)
                const time = new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={idx}
                    className={`chat-message ${isSent ? "sent" : "received"}`}
                  >
                    <div className="chat-avatar">{senderInitial}</div>
                    <div>
                      <div className="sender-name">{msg.sender}</div>
                      <div
                        className={`chat-bubble ${
                          isSent ? "sent" : "received"
                        }`}
                      >
                        {msg.content}
                        <div className="message-time">{time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
