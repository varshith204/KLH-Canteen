import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute role="user"><Dashboard /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute role="user"><Menu /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute role="user"><Orders /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
