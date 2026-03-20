import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import Login from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";  
// import { tourists as dummyTourists, alerts as dummyAlerts, zones as dummyZones } from "./data/dummyData";
// import { getTourists, getAlerts, getZones, updateAlertStatus as updateAlertStatusApi } from "./services/api";
// import Signup from "./pages/Signup";

const App = () => {
  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} /> */}
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
