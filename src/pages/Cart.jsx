import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Cart() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickupTime, setPickupTime] = useState("12:30 PM");
  const [paymentDone, setPaymentDone] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.05);
  const platformFee = cart.length > 0 ? 5 : 0;
  const total = subtotal + gst + platformFee;

  const placeOrder = () => {
    if (cart.length === 0) return alert("Cart is empty");
    if (!paymentDone) return alert("Please mark payment as done before placing order.");

    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
    const userOrders = JSON.parse(localStorage.getItem(`orders-${user.email}`)) || [];
    const activeOrdersAhead = allOrders.filter((order) => order.status !== "Collected").length;

    const order = {
      id: Date.now(),
      email: user.email,
      items: cart,
      subtotal,
      gst,
      platformFee,
      total,
      pickupTime,
      queue: activeOrdersAhead + 1,
      waitTime: cart.reduce((sum, item) => sum + item.time * item.quantity, 0),
      status: "Preparing",
      paymentId: `KLH${Math.floor(100000 + Math.random() * 900000)}`,
      counter: activeOrdersAhead % 3 === 0 ? "KLH Main Canteen" : activeOrdersAhead % 3 === 1 ? "KLH Snacks Counter" : "KLH Juice Counter",
      createdAt: new Date().toLocaleString(),
    };

    const updatedAllOrders = [...allOrders, order];
    const updatedUserOrders = [...userOrders, order];
    localStorage.setItem("allOrders", JSON.stringify(updatedAllOrders));
    localStorage.setItem(`orders-${user.email}`, JSON.stringify(updatedUserOrders));

    const notifications = JSON.parse(localStorage.getItem(`notifications-${user.email}`)) || [];
    notifications.push({ id: Date.now(), message: `Order #${order.id} placed. Queue No: ${order.queue}`, time: new Date().toLocaleTimeString() });
    localStorage.setItem(`notifications-${user.email}`, JSON.stringify(notifications));

    clearCart();
    alert("Order placed successfully!");
    navigate("/orders");
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-orange-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-black text-gray-900 mb-2">KLH Canteen Cart 🛒</h1>
          <p className="text-gray-500 mb-8">Confirm items, choose pickup slot, scan QR and place your KLH canteen order.</p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[30px] shadow-xl p-6">
              {cart.length === 0 ? (
                <div className="text-center py-20"><h2 className="text-3xl font-black text-gray-800">Cart is empty</h2><p className="text-gray-500 mt-3">Add food items from the menu.</p></div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center justify-between border-b py-5 gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-24 h-24 rounded-2xl object-cover" />
                      <div><h2 className="text-xl font-black text-gray-900">{item.name}</h2><p className="text-gray-500">{item.category}</p><p className="font-bold text-orange-600">₹{item.price} × {item.quantity}</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => decreaseQuantity(item.id)} className="qty-btn">−</button>
                      <span className="font-black text-xl w-8 text-center">{item.quantity}</span>
                      <button onClick={() => addToCart(item)} className="qty-btn">+</button>
                      <button onClick={() => removeFromCart(item.id)} className="bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold">Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white rounded-[30px] shadow-xl p-6 h-fit">
              <h2 className="text-3xl font-black mb-5">Bill Details</h2>
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span>GST 5%</span><span>₹{gst}</span></div>
                <div className="flex justify-between"><span>Platform Fee</span><span>₹{platformFee}</span></div>
                <hr />
                <div className="flex justify-between text-2xl font-black text-gray-900"><span>Total</span><span>₹{total}</span></div>
              </div>

              <div className="mt-6">
                <label className="font-bold text-gray-700">Pickup Time Slot</label>
                <select value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="w-full mt-2 p-4 rounded-2xl bg-orange-50 border border-orange-200 outline-none">
                  <option>11:30 AM</option><option>12:00 PM</option><option>12:30 PM</option><option>01:00 PM</option><option>01:30 PM</option><option>02:00 PM</option><option>03:30 PM</option>
                </select>
              </div>

              <div className="mt-6 bg-orange-50 rounded-3xl p-5 text-center border border-orange-100">
                <p className="font-black text-gray-800 mb-3">KLH Smart Canteen QR Payment</p>
                <div className="mx-auto w-48 h-48 bg-white rounded-3xl grid place-items-center shadow-inner border border-orange-200 p-3">
                  <img
                    className="w-full h-full object-contain"
                    src="/payment-qr.png"
                    alt="KLH canteen payment QR"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-3">UPI ID: queuelessklh@upi • Amount: ₹{total}</p>
                <p className="font-black text-orange-600">Pay ₹{total}</p>
                <p className="text-xs text-gray-400 mt-1">Scan the QR, complete payment, then click below.</p>
                <button type="button" onClick={() => setPaymentDone(!paymentDone)} className={`mt-4 px-5 py-3 rounded-2xl font-black ${paymentDone ? "bg-green-600 text-white" : "bg-white text-orange-600 border border-orange-200"}`}>{paymentDone ? "Payment Done ✓" : "I Paid Successfully"}</button>
              </div>

              <button onClick={placeOrder} className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl font-black shadow-xl hover:scale-[1.02] transition">Place Order</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
