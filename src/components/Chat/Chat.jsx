import React, { useState, useEffect } from "react";
import {
  sendMessage,
  subscribeToMessages,
  createGroup,
  fetchGroups,
} from "./chatmain";
import "./Chat.css";
import Navbar from "../Navabar/Navbar";
import Footer from "../Footer/Footer";
import { auth } from "../config/firebaseconfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCamera,
  faArrowLeft,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import Banner from "../ActionHub/Banner";

const groups = ["ClimateChange", "Education", "HumanRights", "GenderEquality"];
const groupImages = {
  ClimateChange: "./assets/images (1).jpg",
  Education: "./assets/85b1ceb1-287e-411a-8acb-1972937e034e.avif",
  HumanRights:
    "./assets/young-people-group-with-human-rights-label-vector-28174371.jpg",
  GenderEquality:
    "./assets/women-diversity-seamless-vector-background-pattern-happy-smiling-female-faces-different-ethnicity-age-race-cartoon-179881651.webp",
};
const ChatApp = () => {
  const [group, setGroup] = useState("ClimateChange");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [joinedGroups, setJoinedGroups] = useState({});
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [customGroups, setCustomGroups] = useState([]);
  const [groupImagesState, setGroupImagesState] = useState(groupImages);

  useEffect(() => {
    const loadGroups = async () => {
      const fetched = await fetchGroups();
      const newCustomGroups = [];
      const updatedImages = { ...groupImages };

      fetched.forEach(({ name, imageUrl }) => {
        if (!groups.includes(name)) {
          newCustomGroups.push(name);
          updatedImages[name] = imageUrl;
        }
      });

      setCustomGroups(newCustomGroups);
      setGroupImagesState(updatedImages);
    };

    loadGroups();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToMessages(group, setMessages);
    return () => unsubscribe();
  }, [group]);

  useEffect(() => {
    const storedGroups = localStorage.getItem("joinedGroups");
    if (storedGroups) {
      setJoinedGroups(JSON.parse(storedGroups));
    }
  }, []);

  const handleJoin = async () => {
    const updatedGroups = { ...joinedGroups, [group]: true };
    setJoinedGroups(updatedGroups);
    localStorage.setItem("joinedGroups", JSON.stringify(updatedGroups));

    const user = auth.currentUser;
    const senderName = user?.email || "Anonymous";

    const joinMessage = `${senderName} joined the group`;
    await sendMessage(group, joinMessage);
  };

  const handleLeave = async () => {
    const updatedGroups = { ...joinedGroups, [group]: false };
    setJoinedGroups(updatedGroups);
    localStorage.setItem("joinedGroups", JSON.stringify(updatedGroups));

    const user = auth.currentUser;
    const senderName = user?.email || "Anonymous";

    const leaveMessage = `${senderName} left the group`;
    await sendMessage(group, leaveMessage);
  };

  const handleSend = () => {
    if (!joinedGroups[group]) {
      toast.error("Please join the group to send messages.");
      return;
    }
    sendMessage(group, input);
    setInput("");
  };

  return (
    <>
      <Navbar />
      <Banner
        imageUrl="./assets/group-chat-etiquette-10-do-and-don-ts.jpg"
        title="Community Chat"
      />
      <div className="chat-box-container">
        <div className="chat-container">
          {/* Sidebar */}
          <div className="sidebar">
            {/* <h2>Groups</h2> */}
            <div className="group-list">
              <button
                onClick={() => setShowCreateGroup(true)}
                className="create-group-btn"
              >
                <FontAwesomeIcon icon={faUsers} style={{ marginLeft: "8px" }} />
                Create Group
              </button>

              {[...groups, ...customGroups]
                .filter(Boolean) // removes undefined/null values
                .map((g) => (
                  <button
                    key={g}
                    onClick={() => setGroup(g)}
                    className={group === g ? "active" : ""}
                  >
                    {groupImages[g] ? (
                      <img src={groupImages[g]} alt={g} className="group-img" />
                    ) : (
                      <div className="group-avatar-placeholder">
                        {g.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {g.replace(/([A-Z])/g, " $1").trim()}
                  </button>
                ))}
            </div>
            {showCreateGroup && (
              <div className="create-group-sidebar">
                <div className="create-group-header">
                  <span
                    className="arrow-icon"
                    onClick={() => setShowCreateGroup(false)}
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeft}
                      className="arrow-icon"
                    />
                  </span>
                  <h2>New Group</h2>
                </div>
                <div className="create-group-content">
                  

                  <div className="group-input">
                    <label>Group Name</label>
                    <input
                      type="text"
                      placeholder="Group Name"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    className="create-btn"
                    onClick={async () => {
                      if (newGroupName.trim()) {
                        const imageUrl = groupImages[newGroupName]; // Optional image
                        await createGroup(newGroupName, imageUrl);
                        setCustomGroups([...customGroups, newGroupName]);
                        setNewGroupName("");
                        setShowCreateGroup(false);
                      } else {
                        toast.error("Group name cannot be empty");
                      }
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="chat-section">
            <div className="chat-header">
              <div className="chat-header-content">
                {groupImages[group] ? (
                  <img
                    src={groupImages[group]}
                    alt="group-profile"
                    className="chat-header-img"
                  />
                ) : (
                  <div className="chat-header-img group-avatar-placeholder">
                    {group.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="chat-header-text">
                  <strong>
                    {group.replace(/([A-Z])/g, " $1").trim()}
                  </strong>
                  {/* <span>Good Times</span> */}
                </div>
              </div>
              <div>
                {joinedGroups[group] ? (
                  <button className="leave-btn" onClick={handleLeave}>
                    Leave
                  </button>
                ) : (
                  <button className="join-btn" onClick={handleJoin}>
                    Join
                  </button>
                )}
              </div>
            </div>
            <div className="chat-box">
              {messages.map((msg, index) => {
                const isSystemMessage =
                  (msg.text?.includes("joined the group") ||
                    msg.text?.includes("left the group")) &&
                  !msg.text.includes(":");

                return isSystemMessage ? (
                  <p key={index} className="system-message">
                    {msg.text.includes(currentUserEmail)
                      ? msg.text.includes("joined")
                        ? "You joined the group"
                        : "You left the group"
                      : (() => {
                          const [email, action] = msg.text.split(" ");
                          const name = email.split("@")[0];
                          const capitalizedName =
                            name.charAt(0).toUpperCase() + name.slice(1);
                          return `${capitalizedName} ${action} the group`;
                        })()}
                  </p>
                ) : (
                  <div
                    key={index}
                    className={`messages-container ${
                      msg.senderName === currentUserEmail ? "sent" : "received"
                    }`}
                  >
                    <img
                      src={
                        msg.senderName === currentUserEmail
                          ? "https://www.w3schools.com/w3images/avatar2.png"
                          : "https://www.w3schools.com/howto/img_avatar.png"
                      }
                      alt="profile"
                      className="profile-img"
                    />
                    <div className="message">
                      <div>
                        <div>
                          <strong>
                            {msg.senderName === currentUserEmail
                              ? "You"
                              : msg.senderName
                                  ?.split("@")[0]
                                  .replace(/^\w/, (c) => c.toUpperCase())}
                          </strong>
                          : {msg.text}
                          <div className="message-time">
                            {msg.timestamp?.seconds
                              ? new Date(
                                  msg.timestamp.seconds * 1000
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Box */}
            <div className="input-area">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChatApp;

