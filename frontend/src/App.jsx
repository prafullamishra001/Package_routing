import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ParcelRouting from "./pages/ParcelRouting";
import BatchUpload from "./pages/BatchUpload";
import RoutingHistory from "./pages/RoutingHistory";

const App = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/parcel-routing" element={<ParcelRouting />} />
          <Route path="/batch-upload" element={<BatchUpload />} />
          <Route path="/routing-history" element={<RoutingHistory />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;