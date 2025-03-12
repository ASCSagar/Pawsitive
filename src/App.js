import React from "react";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme'; // Make sure this is your custom theme

import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import Profile from "./components/Profile/Profile";
import DogResources from "./components/Resources/DogResources";
import CatResources from "./components/Resources/CatResources";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ResourceList from "./components/Resources/ResourceList/ResourceList";
import ResourceDetail from "./components/Resources/ResourceDetail/ResourceDetail";
import NotFound from "./components/NotFound/NotFound";


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen bg-lavender-50">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Home Route */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            
            {/* Dog Resources Routes */}
            <Route
              path="/dog-resources"
              element={
                <ProtectedRoute>
                  <DogResources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources/:category"
              element={
                <ProtectedRoute>
                  <ResourceList />
                </ProtectedRoute>
              }
            />
            
            {/* Cat Resources Routes */}
            <Route
              path="/cat-resources"
              element={
                <ProtectedRoute>
                  <CatResources />
                </ProtectedRoute>
              }
            />
            
            {/* User Profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* Resource Detail Page */}
            <Route
              path="/resource-details/:resourceId"
              element={
                <ProtectedRoute>
                  <ResourceDetail />
                </ProtectedRoute>
              }
            />
            
            {/* Map View Route */}
            <Route
              path="/map/:category"
              element={
                <ProtectedRoute>
                  <ResourceList viewMode="map" />
                </ProtectedRoute>
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;