import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, onAuthStateChanged } from './pages/firebase.js';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import { TodoWrapper } from './components/TodoWrapper';
import Login from './pages/Login';
import Register from './pages/Register';
import Reset from './pages/Reset';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="loading">Loading...</div>;
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
      <div className="App">
        
        <div className="content">
          <Routes>
            {/* Auth routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="/reset" element={<Reset />} />
            
            {/* Protected routes */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/todo" 
              element={
                <ProtectedRoute>
                  <TodoWrapper />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </div>
  );
}

export default App;