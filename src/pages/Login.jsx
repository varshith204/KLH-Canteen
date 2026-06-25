import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin") navigate("/admin", { replace: true });
    if (user?.role === "user") navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (!result.success) return setError(result.message);
    navigate(result.role === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <main className="min-h-screen login-campus relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-950/55"></div>
      <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white text-red-700 grid place-items-center font-black text-2xl shadow-xl">KLH</div>
          <div><h1 className="font-black text-2xl leading-none">KLH Smart Canteen</h1><p className="text-orange-100 text-sm font-bold">QueueLess Digital Ordering</p></div>
        </div>
        <span className="hidden md:inline-flex bg-white/15 px-4 py-2 rounded-full border border-white/20 font-bold">For KLH students & canteen admin</span>
      </div>

      <section className="relative z-10 w-full max-w-7xl grid lg:grid-cols-[1.15fr_.85fr] overflow-hidden rounded-[38px] bg-white/10 border border-white/25 shadow-2xl backdrop-blur-xl mt-20 md:mt-10">
        <div className="text-white p-8 md:p-12 lg:p-14 min-h-[660px] flex flex-col justify-end bg-gradient-to-br from-red-900/35 via-orange-700/20 to-slate-950/40">
          <p className="w-fit bg-white/20 border border-white/20 rounded-full px-4 py-2 font-black mb-5">KLH University Campus</p>
          <h2 className="text-5xl md:text-7xl font-black leading-tight max-w-3xl">Order from campus canteen without standing in queue.</h2>
          <p className="text-xl text-orange-50 mt-5 max-w-2xl">A KLH-themed smart canteen system with student login, QR payment, pickup slots, live queue status and admin analytics.</p>
          <div className="grid sm:grid-cols-3 gap-4 mt-8 max-w-3xl">
            <CampusBadge title="Campus" value="KLH" />
            <CampusBadge title="Payment" value="QR" />
            <CampusBadge title="Pickup" value="Slots" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-7 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-red-600 font-black uppercase tracking-wide">Welcome to KLH</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-950 mt-2">Login</h2>
            <p className="text-gray-500 mt-3">Use your KLH email. Empty passwords are blocked.</p>
          </div>

          {error && <div className="mb-5 rounded-2xl bg-red-50 text-red-600 border border-red-200 p-4 font-bold">{error}</div>}

          <label className="font-black text-gray-700 mb-2">KLH Email</label>
          <input type="email" placeholder="yourname@klh.edu.in" className="w-full rounded-2xl bg-orange-50 border border-orange-200 p-4 mb-5 outline-none focus:ring-4 focus:ring-orange-200" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label className="font-black text-gray-700 mb-2">Password</label>
          <div className="relative mb-6">
            <input type={showPassword ? "text" : "password"} placeholder="minimum 4 characters" className="w-full rounded-2xl bg-orange-50 border border-orange-200 p-4 pr-24 outline-none focus:ring-4 focus:ring-orange-200" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl text-red-600 font-black hover:bg-orange-100">{showPassword ? "Hide" : "Show"}</button>
          </div>

          <button className="rounded-2xl bg-gradient-to-r from-red-700 via-orange-600 to-red-600 text-white p-4 font-black text-lg shadow-xl hover:scale-[1.02] transition">Enter KLH Smart Canteen</button>

          <div className="mt-7 rounded-3xl bg-gray-50 border border-gray-100 p-5 text-sm text-gray-600 space-y-2">
            <p><b>Student:</b> any @klh.edu.in email + password minimum 4 characters</p>
            <p><b>Admin:</b> admin@klh.edu.in / admin123</p>
          </div>
        </form>
      </section>
    </main>
  );
}

function CampusBadge({ title, value }) {
  return <div className="rounded-3xl bg-white/15 border border-white/20 p-5 backdrop-blur"><p className="text-orange-100 font-bold">{title}</p><h3 className="text-3xl font-black">{value}</h3></div>;
}

export default Login;
