import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";  

const App = () => {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route
              index
              element={<Navigate to="/login" replace />}
            />
          </Route>
          <Route path="login" element={<Login />} />
            {/* <Route path="signup" element={<Signup />} /> */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
