import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CompareBar from './components/CompareBar';
import Home from './pages/Home';
import Colleges from './pages/Colleges';
import CollegeDetails from './pages/CollegeDetails';
import Compare from './pages/Compare';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/admin/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/colleges" element={<Colleges />} />
                <Route path="/colleges/:id" element={<CollegeDetails />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <CompareBar />
            <Footer />
          </div>
        </Router>
      </CompareProvider>
    </AuthProvider>
  );
}

export default App;
