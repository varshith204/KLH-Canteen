import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Dashboard() {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const orders = JSON.parse(localStorage.getItem(`orders-${user?.email}`)) || [];
  const latestOrder = orders[orders.length - 1];
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-amber-50">
        <div className="campus-hero relative overflow-hidden px-6 md:px-12 py-16 md:py-20 text-white">
          <div className="absolute inset-0 bg-black/45"></div>
          <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-center">
            <div>
              <p className="inline-block bg-white/20 px-4 py-2 rounded-full font-black mb-5 border border-white/25">KLH University • Student Canteen Portal</p>
              <h1 className="text-5xl md:text-7xl font-black leading-tight">KLH Smart Canteen</h1>
              <p className="text-xl mt-5 text-orange-50 max-w-2xl">Order before break, pay using QR, track queue number and collect at your selected KLH campus counter.</p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/menu" className="bg-white text-red-700 font-black px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition">Order Now</Link>
                <Link to="/orders" className="bg-black/30 text-white border border-white/30 font-black px-8 py-4 rounded-2xl hover:bg-black/45 transition">Track Order</Link>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-xl border border-white/25 rounded-[34px] p-6 shadow-2xl">
              <h2 className="text-3xl font-black mb-5">Campus Counters</h2>
              <Counter name="Main Canteen" status="Open" rush="High at 12:30 PM" />
              <Counter name="Snacks & Tea Point" status="Fast" rush="Avg 5 min" />
              <Counter name="Juice Counter" status="Open" rush="Cold drinks available" />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="stat-card"><p>Cart Items</p><h2>{cartCount}</h2></div>
            <div className="stat-card"><p>Total Orders</p><h2>{orders.length}</h2></div>
            <div className="stat-card"><p>Total Spent</p><h2>₹{totalSpent}</h2></div>
            <div className="stat-card"><p>Latest Status</p><h3>{latestOrder ? latestOrder.status : "No Order"}</h3></div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-2 bg-white rounded-[34px] shadow-xl overflow-hidden border border-orange-100">
              <img src="/klh-campus-real.jpg" alt="KLH University campus" className="w-full h-72 object-cover" />
              <div className="p-7">
                <p className="text-red-600 font-black">Built for KLH Campus Life</p>
                <h2 className="text-4xl font-black text-gray-900 mt-2">Lunch rush made simple</h2>
                <p className="text-gray-500 mt-3">The system connects students, canteen counters, QR payment and admin order management in one clean React application.</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-950 to-red-800 text-white rounded-[34px] shadow-xl p-7">
              <p className="font-black text-orange-200">Today's KLH Special</p>
              <h2 className="text-4xl font-black mt-2">Burger + Fries + Coffee</h2>
              <p className="mt-3 text-orange-50">Perfect for short break orders.</p>
              <Link to="/menu" className="inline-block mt-6 bg-white text-red-700 px-6 py-3 rounded-2xl font-black">View Menu</Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Feature icon="🎓" title="KLH Email Login" text="Only KLH college email users can access student features." />
            <Feature icon="📍" title="Campus Pickup" text="Choose counters and pickup time slots inside KLH campus." />
            <Feature icon="📊" title="Admin Analytics" text="Admin tracks revenue, popular foods, status and queue flow." />
          </div>
        </div>
      </section>
    </>
  );
}

function Counter({ name, status, rush }) {
  return <div className="bg-white/15 p-5 rounded-3xl flex justify-between gap-4 mb-4"><div><b>{name}</b><p className="text-orange-100 text-sm">{rush}</p></div><span className="font-black text-green-200">{status}</span></div>;
}
function Feature({ icon, title, text }) {
  return <div className="feature-card bg-white"><div className="text-4xl mb-3">{icon}</div><h2>{title}</h2><p>{text}</p></div>;
}

export default Dashboard;
