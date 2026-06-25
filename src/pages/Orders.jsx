import Navbar from "../components/Navbar";
import OrderTracker from "../components/OrderTracker";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { user } = useAuth();
  const orders = JSON.parse(localStorage.getItem(`orders-${user?.email}`)) || [];
  const notifications = JSON.parse(localStorage.getItem(`notifications-${user?.email}`)) || [];

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-orange-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="orders-hero rounded-[34px] p-8 md:p-12 text-white mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/45"></div>
            <div className="relative z-10 grid lg:grid-cols-[1fr_320px] gap-8 items-center">
              <div>
                <p className="font-black bg-white/20 inline-block px-4 py-2 rounded-full border border-white/25">KLH Canteen Order Tracker</p>
                <h1 className="text-5xl md:text-6xl font-black mt-4">My Campus Orders</h1>
                <p className="text-orange-50 mt-3 text-lg">Track payment ID, pickup slot, KLH counter, queue number and live preparation status.</p>
              </div>
              <div className="bg-white/15 rounded-3xl p-5 border border-white/20 backdrop-blur">
                <p className="font-bold text-orange-100">Pickup Location</p>
                <h2 className="text-2xl font-black">KLH Main Canteen</h2>
                <p className="text-sm text-orange-50 mt-2">Show your order ID at the assigned counter.</p>
              </div>
            </div>
          </div>

          {notifications.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
              <h2 className="text-2xl font-black mb-4">KLH Alerts</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {notifications.slice().reverse().slice(0, 4).map((note) => (
                  <div key={note.id} className="bg-orange-50 border border-orange-100 p-4 rounded-2xl"><p className="font-bold text-gray-800">{note.message}</p><p className="text-sm text-gray-500">{note.time}</p></div>
                ))}
              </div>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-16 text-center"><h2 className="text-3xl font-black text-gray-900">No orders yet</h2><p className="text-gray-500 mt-3">Place an order from the KLH menu.</p></div>
          ) : (
            <div className="grid gap-6">
              {orders.slice().reverse().map((order) => (
                <div key={order.id} className="bg-white rounded-[30px] shadow-xl p-6 border border-orange-100">
                  <div className="flex flex-wrap justify-between gap-4">
                    <div><h2 className="text-3xl font-black text-gray-900">Order #{order.id}</h2><p className="text-gray-500 mt-1">{order.createdAt}</p><p className="text-sm font-bold text-red-600 mt-1">Payment ID: {order.paymentId || "Paid"}</p></div>
                    <div className="text-right"><p className="text-gray-500">Total</p><h3 className="text-3xl font-black text-red-600">₹{order.total}</h3></div>
                  </div>
                  <div className="grid md:grid-cols-5 gap-4 mt-6">
                    <Info title="Pickup Slot" value={order.pickupTime} />
                    <Info title="Queue No" value={`#${order.queue}`} />
                    <Info title="KLH Counter" value={order.counter || "Main Canteen"} />
                    <Info title="Wait Time" value={`${order.waitTime} mins`} />
                    <Info title="Status" value={order.status} orange />
                  </div>
                  <div className="mt-6"><h3 className="font-black mb-2">Items</h3><div className="flex flex-wrap gap-2">{order.items.map((item) => <span key={item.id} className="bg-gray-100 px-4 py-2 rounded-full font-bold text-sm">{item.name} × {item.quantity || 1}</span>)}</div></div>
                  <OrderTracker status={order.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function Info({ title, value, orange }) {
  return <div className="bg-orange-50 p-4 rounded-2xl"><p className="text-gray-500">{title}</p><h3 className={`font-black ${orange ? "text-red-600" : ""}`}>{value}</h3></div>;
}
export default Orders;
