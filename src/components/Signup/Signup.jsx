import { useState } from "react";
import "./Signup.css"; // Import CSS
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../config/firebaseconfig"; 

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // Added phone number state
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

   
    const handleSignup = async (e) => {
        e.preventDefault();
      
        if (!name || !email || !phone || !password) {
          toast.error("All fields are required!");
          return;
        }
      
        if (!/^\d{10}$/.test(phone)) {
          toast.error("Please enter a valid 10-digit phone number.");
          return;
        }
      
        const auth = getAuth(app);
      
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
      
          await updateProfile(user, { displayName: name });
      
          const newUser = {
            uid: user.uid,
            name,
            email,
            phone,
          };
      
          // Safely get existing users array from localStorage
          let existingUsers;
          try {
            const storedData = JSON.parse(localStorage.getItem("users"));
            existingUsers = Array.isArray(storedData) ? storedData : [];
          } catch {
            existingUsers = [];
          }
      
          // Add the new user
          existingUsers.push(newUser);
      
          // Save updated array
          localStorage.setItem("users", JSON.stringify(existingUsers));
      
          toast.success("Sign-up successful!");
          navigate("/login");
        } catch (error) {
          toast.error(error.message);
        }
      };
      

    return (
        <div className="container">
            {/* Left Side Image & Text */}
            <div className="left-section">
                <img src="https://pl.tedcdn.com/ted-auth-assets/bg-pride-001.svg" alt="TED Login" className="left-image" />
            </div>

            {/* Right Side Form */}
            <div className="right-section">
                <h3>Create a new account</h3>
                <form className="signup-form" onSubmit={handleSignup}>
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Enter 10-digit phone number"
                    />

                    <div className="password-container">
                        <label className="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            required
                            className="input-field"
                        />
                        <span
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="password-toggle"
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-5 h-5" />
                        </span>
                    </div>

                    <button type="submit" className="continue-btn">Continue</button>
                </form>
                     
                <p className="signup-text">
                    Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
