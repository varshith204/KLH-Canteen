import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const homePath = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg px-6 py-4 flex flex-wrap gap-4 justify-between items-center border-b border-orange-100">
      <Link to={homePath} className="flex items-center gap-3">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white grid place-items-center text-2xl shadow-lg">Q</span>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-orange-600 leading-none">KLH Digital Food Hub</h1>
          <p className="text-xs font-bold text-gray-500">CampusBite Campus Ordering</p>
        </div>
      </Link>

      <div className="flex items-center gap-4 md:gap-6 font-semibold text-gray-700 flex-wrap">
        {user?.role === "admin" ? (
          <Link to="/admin" className="hover:text-orange-600">Admin Dashboard</Link>
        ) : (
          <>
            <Link to="/dashboard" className="hover:text-orange-600">Home</Link>
            <Link to="/menu" className="hover:text-orange-600">Menu</Link>
            <Link to="/cart" className="hover:text-orange-600">Cart ({cartCount})</Link>
            <Link to="/orders" className="hover:text-orange-600">Orders</Link>
            <NotificationBell />
          </>
        )}

        <span className="text-xs bg-orange-100 text-orange-700 px-3 py-2 rounded-full max-w-[220px] truncate">
          {user?.email}
        </span>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 font-bold">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
