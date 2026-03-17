import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";  
// import { tourists as dummyTourists, alerts as dummyAlerts, zones as dummyZones } from "./data/dummyData";
// import { getTourists, getAlerts, getZones, updateAlertStatus as updateAlertStatusApi } from "./services/api";
import Signup from "./pages/Signup";

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
            <Route
              path="dashboard"
              element={
                <Dashboard
                  tourists={tourists}
                  alerts={alerts}
                  zones={zones}
                  updateAlertStatus={handleUpdateAlertStatus}
                  loading={loading}
                  error={error}
                  // onRetry={fetchData}
                  useDummy={useDummy}
                  setUseDummy={setUseDummy}
                />
              }
            />
            <Route path="tourists" element={<Tourist tourists={tourists} loading={loading} />} />
            <Route
              path="tourists/:touristId"
              element={<TouristDetail tourists={tourists} alerts={alerts} />}
            />
            <Route
              path="alerts"
              element={
                <Alerts 
                  alerts={alerts} 
                  updateAlertStatus={handleUpdateAlertStatus} 
                  loading={loading} 
                />
              }
            />
            <Route path="reports" element={<Reports zones={zones}/>} />
            <Route path="riskyzones" element={<RiskyZones zones={zones} loading={loading} onRefresh={fetchData} />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
