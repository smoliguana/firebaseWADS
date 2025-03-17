import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db, logout } from "./firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc, doc } from "firebase/firestore";
import "./ProfilePage.css";

function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [user, loading, navigate]);

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1 className="profile-name">Profile Page</h1>
        </div>
        {user ? (
          <div className="profile-details">
            <p><span>Name:</span> {userData?.name || user.displayName}</p>
            <p><span>Email:</span> {user.email}</p>
            <div className="profile-actions">
              <button onClick={logout} className="profile-button primary-button">Logout</button>
              <Link to="/todo">
                <button className="profile-button secondary-button">Back to Tasks</button>
              </Link>
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;