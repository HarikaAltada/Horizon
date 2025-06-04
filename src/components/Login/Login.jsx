import { useState } from "react";
import "./Login.css"; // Import CSS
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../config/firebaseconfig"; // Make sure this points to your firebase config file

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
  
  
    const handleLogin = async (e) => {
      e.preventDefault();
    
      const auth = getAuth(app);
    
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
    
        // Get phone number from localStorage 'users' list
        const allUsers = JSON.parse(localStorage.getItem("users")) || [];
        const matchedUser = allUsers.find((u) => u.email === user.email);
    
        const currentUser = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "",
          phone: matchedUser?.phone || "", // Get phone if exists
        };
    
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    
        toast.success("Login successful!");
        navigate("/"); // or your dashboard
      } catch (error) {
        toast.error("Invalid email or password!");
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
        <h3>Sign in to your account</h3>
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email address</label>
          <input
            type="email"
             placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
            <div className="password-container">
            <label className="password">Password</label>
                      <input
                        id="password"
                        name="password"
                         placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="input-field"
                       
                      />
                      <span
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="password-toggle"
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          className="w-5 h-5"
                        />
                      </span>
                    </div>
          <button type="submit" className="continue-btn">Continue</button>
        </form>
             
        <p className="signup-text">
          Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
