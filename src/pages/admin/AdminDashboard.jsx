import { useMemo, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import Navbar from "../../components/Navbar";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminDashboard() {
  const [orders, setOrders] = useState(JSON.parse(localStorage.getItem("allOrders")) || []);
  const [filter, setFilter] = useState("All");

  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const preparing = orders.filter((order) => order.status === "Preparing").length;
  const ready = orders.filter((order) => order.status === "Ready").length;
  const collected = orders.filter((order) => order.status === "Collected").length;
  const students = new Set(orders.map((order) => order.email)).size;

  const filteredOrders = filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const popularItems = useMemo(() => {
    const map = {};
    orders.forEach((order) => order.items.forEach((item) => {
      map[item.name] = (map[item.name] || 0) + (item.quantity || 1);
    }));
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [orders]);

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => order.id === orderId ? { ...order, status: newStatus } : order);
    setOrders(updatedOrders);
    localStorage.setItem("allOrders", JSON.stringify(updatedOrders));

    const updatedOrder = updatedOrders.find((order) => order.id === orderId);
    const userOrders = JSON.parse(localStorage.getItem(`orders-${updatedOrder.email}`)) || [];
    const updatedUserOrders = userOrders.map((order) => order.id === orderId ? { ...order, status: newStatus } : order);
    localStorage.setItem(`orders-${updatedOrder.email}`, JSON.stringify(updatedUserOrders));

    const notifications = JSON.parse(localStorage.getItem(`notifications-${updatedOrder.email}`)) || [];
    notifications.push({
      id: Date.now(),
      message: newStatus === "Ready" ? `Your order #${orderId} is READY. Please collect it from ${updatedOrder.counter || "the counter"}.` : `Your order #${orderId} status updated to ${newStatus}.`,
      time: new Date().toLocaleTimeString(),
    });
    localStorage.setItem(`notifications-${updatedOrder.email}`, JSON.stringify(notifications));
    alert(`Order updated to ${newStatus}`);
  };

  const statusChart = {
    labels: ["Preparing", "Ready", "Collected"],
    datasets: [{ data: [preparing, ready, collected], backgroundColor: ["#f6c453", "#15803d", "#1d4ed8"], borderColor: "#fffaf0", borderWidth: 4 }],
  };

  const itemChart = {
    labels: popularItems.map(([name]) => name),
    datasets: [{ label: "Items Ordered", data: popularItems.map(([, count]) => count), backgroundColor: "#7f111d", borderRadius: 12 }],
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-slate-100">
        <div className="admin-hero relative px-6 md:px-10 py-14 text-white">
          <div className="absolute inset-0 bg-black/45"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <p className="font-black bg-white/20 inline-block px-4 py-2 rounded-full border border-white/25">Admin Access Only</p>
            <h1 className="text-5xl md:text-7xl font-black mt-4">KLH Canteen Command Center</h1>
            <p className="text-orange-50 mt-4 text-xl">Manage orders, counters, revenue and student notifications.</p>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-6 mb-10">
            <Card title="Revenue" value={`₹${revenue}`} tone="green" />
            <Card title="Orders" value={orders.length} />
            <Card title="Students" value={students} />
            <Card title="Preparing" value={preparing} tone="orange" />
            <Card title="Ready / Collected" value={`${ready}/${collected}`} tone="blue" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            <div className="bg-white rounded-[30px] shadow-xl p-6"><h2 className="text-2xl font-black mb-4">Order Status</h2><div className="max-h-[320px] flex justify-center"><Doughnut data={statusChart} /></div></div>
            <div className="bg-white rounded-[30px] shadow-xl p-6"><h2 className="text-2xl font-black mb-4">Popular Food Items</h2><Bar data={itemChart} options={{ responsive: true, plugins: { legend: { display: false } } }} /></div>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <div className="flex flex-wrap justify-between gap-4 mb-6">
              <h2 className="text-3xl font-black">Live Orders</h2>
              <div className="flex gap-2 flex-wrap">
                {["All", "Preparing", "Ready", "Collected"].map((item) => <button key={item} onClick={() => setFilter(item)} className={`px-4 py-2 rounded-xl font-black ${filter === item ? "bg-orange-600 text-white" : "bg-orange-50 text-orange-700"}`}>{item}</button>)}
              </div>
            </div>

            {filteredOrders.length === 0 ? <p className="text-gray-500">No orders found.</p> : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[950px]">
                  <thead><tr className="border-b bg-orange-50"><th className="p-4">Order</th><th className="p-4">Student</th><th className="p-4">Items</th><th className="p-4">Total</th><th className="p-4">Pickup</th><th className="p-4">Counter</th><th className="p-4">Status</th><th className="p-4">Update</th></tr></thead>
                  <tbody>
                    {filteredOrders.slice().reverse().map((order) => (
                      <tr key={order.id} className="border-b hover:bg-orange-50/60">
                        <td className="p-4 font-black">#{order.id}</td>
                        <td className="p-4">{order.email}</td>
                        <td className="p-4">{order.items.map((item) => `${item.name} × ${item.quantity || 1}`).join(", ")}</td>
                        <td className="p-4 font-black">₹{order.total}</td>
                        <td className="p-4">{order.pickupTime}</td>
                        <td className="p-4">{order.counter || "Counter A"}</td>
                        <td className="p-4"><span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">{order.status}</span></td>
                        <td className="p-4 flex gap-2 flex-wrap">
                          <button onClick={() => updateStatus(order.id, "Preparing")} className="bg-orange-500 text-white px-3 py-2 rounded-xl font-bold">Preparing</button>
                          <button onClick={() => updateStatus(order.id, "Ready")} className="bg-green-500 text-white px-3 py-2 rounded-xl font-bold">Ready</button>
                          <button onClick={() => updateStatus(order.id, "Collected")} className="bg-blue-500 text-white px-3 py-2 rounded-xl font-bold">Collected</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Card({ title, value, tone }) {
  const color = tone === "green" ? "text-green-600" : tone === "orange" ? "text-orange-600" : tone === "blue" ? "text-blue-600" : "text-gray-900";
  return <div className="bg-white rounded-3xl shadow-xl p-6"><p className="text-gray-500">{title}</p><h2 className={`text-4xl font-black ${color}`}>{value}</h2></div>;
}

export default AdminDashboard;
