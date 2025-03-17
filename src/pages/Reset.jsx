import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth, sendPasswordReset } from "../pages/firebase.js"; 
import "./Reset.css";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading] = useAuthState(auth);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    const response = await sendPasswordReset(email); // ✅ Correct function call
    if (response.success) {
      setSuccessMessage("Password reset email sent. Check your inbox.");
      setErrorMessage("");
    } else {
      setErrorMessage(response.error);
      setSuccessMessage("");
    }
  };

  return (
    <div className="reset">
      <div className="reset__container">
        <h2>Reset Password</h2>
        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        
        <input
          type="email"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        
        <button className="reset__btn" onClick={handleResetPassword}>
          Send Password Reset Email
        </button>
        
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}

export default Reset;
