import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { auth } from './firebase.js'; 
import { useAuthState } from 'react-firebase-hooks/auth';

function LandingPage() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/login');
  }, [user, loading, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <h1 style={styles.heading}>Welcome to Boo</h1>
        <p style={styles.subheading}>Your personal task management solution</p>
        
        <div style={styles.buttonContainer}>
          <Link to="/todo">
            <button style={styles.primaryButton}>Get Started</button>
          </Link>
        </div>
      </div>
      
      <div style={styles.featuresSection}>
        <div style={styles.feature}>
          <h2>Manage Tasks</h2>
          <p>Organize your daily tasks with our intuitive todo list</p>
          <Link to="/todo">
            <button style={styles.secondaryButton}>Todo List</button>
          </Link>
        </div>
        
        <div style={styles.feature}>
          <h2>Your Profile</h2>
          <p>Customize your profile and track your productivity</p>
          <Link to="/profile">
            <button style={styles.secondaryButton}>View Profile</button>
          </Link>
        </div>
      </div>
      
      <div style={styles.footer}>
        <NavLink to="/" style={styles.footerLink}>Home</NavLink>
        <NavLink to="/todo" style={styles.footerLink}>Todo</NavLink>
        <NavLink to="/profile" style={styles.footerLink}>Profile</NavLink>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    textAlign: 'center',
    background: 'url("/bb.png") no-repeat center center/cover',
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6rem 2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  heading: {
    fontSize: '3rem',
    color: '#333',
    marginBottom: '1rem',
  },
  subheading: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '2rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  primaryButton: {
    padding: '12px 30px',
    fontSize: '1.2rem',
    background: '#646cff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  featuresSection: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '2rem',
    padding: '4rem 2rem',
    backgroundColor: 'white',
  },
  feature: {
    width: '300px',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    background: 'white',
  },
  secondaryButton: {
    padding: '8px 16px',
    fontSize: '1rem',
    background: 'transparent',
    color: '#646cff',
    border: '2px solid #646cff',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem',
    backgroundColor: '#f8f8f8',
    marginTop: 'auto',
  },
  footerLink: {
    color: '#666',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
};

export default LandingPage;
