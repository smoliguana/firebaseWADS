import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, registerWithEmailAndPassword } from "../pages/firebase"; 
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const register = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }
    try {
      await registerWithEmailAndPassword(name, email, password);
      navigate("/login", { replace: true }); // ✅ Redirects to login after successful registration
    } catch (error) {
      console.error("Registration error:", error);
      alert("Failed to register. Please try again.");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  return (
    <div className="auth-container">
      <div className="register">
        <div className="register__container">
          <h2>Register</h2>
          <input 
            type="text" 
            className="register__textBox" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <input 
            type="email" 
            className="register__textBox"
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            className="register__textBox"
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="register__btn" onClick={register}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Register;