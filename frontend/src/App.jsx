import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ParcelRouting from "./pages/ParcelRouting";
import BatchUpload from "./pages/BatchUpload";
import RoutingHistory from "./pages/RoutingHistory";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/parcel-routing" element={<ParcelRouting />} />
        <Route path="/batch-upload" element={<BatchUpload />} />
        <Route path="/routing-history" element={<RoutingHistory />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;