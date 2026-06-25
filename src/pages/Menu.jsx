import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import FoodCard from "../components/FoodCard";
import { useCart } from "../context/CartContext";

const foods = [
  { id: 1, name: "KLH Cheese Burger", category: "Fast Food", price: 89, rating: 4.8, time: 8, description: "Loaded burger with cheese, veggies and spicy sauce.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200" },
  { id: 2, name: "KLH Pizza", category: "Fast Food", price: 159, rating: 4.7, time: 12, description: "Fresh veggie pizza with extra cheese and herbs.", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200" },
  { id: 3, name: "Canteen Veg Sandwich", category: "Snacks", price: 59, rating: 4.5, time: 5, description: "Grilled sandwich with fresh vegetables and mayo.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1200" },
  { id: 4, name: "Hakka Noodles", category: "Chinese", price: 99, rating: 4.6, time: 10, description: "Spicy street-style noodles with crunchy veggies.", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=1200" },
  { id: 5, name: "Crispy French Fries", category: "Snacks", price: 69, rating: 4.4, time: 6, description: "Crispy golden fries served with ketchup.", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200" },
  { id: 6, name: "Cold Coffee", category: "Beverages", price: 79, rating: 4.9, time: 4, description: "Chilled creamy coffee with chocolate topping.", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1200" },
  { id: 7, name: "Paneer Roll", category: "Rolls", price: 109, rating: 4.7, time: 9, description: "Soft roll filled with spicy paneer and onions.", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200" },
  { id: 8, name: "Hot Samosa", category: "Indian", price: 25, rating: 4.3, time: 3, description: "Hot crispy samosa with potato filling.", image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?q=80&w=1200" },
  { id: 9, name: "Chocolate Brownie", category: "Dessert", price: 75, rating: 4.8, time: 4, description: "Soft chocolate brownie with rich cocoa flavor.", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1200" },
];

function Menu() {
  const { addToCart, cart, cartCount } = useCart();
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(foods.map((food) => food.category))];

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(search.toLowerCase()) || food.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || food.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleAdd = (food) => {
    addToCart(food);
    setToast(`${food.name} added to cart ✅`);
    setTimeout(() => setToast(""), 1700);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-orange-50">
        {toast && <div className="fixed top-24 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold">{toast}</div>}

        <div className="menu-hero relative px-6 md:px-10 py-16 text-white">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <p className="font-black bg-white/20 inline-block px-4 py-2 rounded-full border border-white/25">KLH Canteen Menu</p>
            <h1 className="text-5xl md:text-7xl font-black mt-5">Campus food, zero waiting.</h1>
            <p className="text-xl mt-4 text-orange-50">Choose snacks, beverages, rolls and combos before reaching the counter.</p>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <div className="bg-white rounded-[30px] shadow-xl p-5 mb-8 grid lg:grid-cols-3 gap-4 items-center">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search KLH canteen food..." className="lg:col-span-2 p-4 rounded-2xl bg-orange-50 border border-orange-200 outline-none focus:ring-4 focus:ring-orange-200" />
            <div className="bg-orange-100 rounded-2xl p-4 font-black text-orange-700 text-center">Cart: {cartCount} items • ₹{total}</div>
          </div>

          <div className="flex gap-3 flex-wrap mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-5 py-3 rounded-2xl font-black transition ${category === cat ? "bg-orange-600 text-white shadow-lg" : "bg-white text-gray-700 hover:bg-orange-100"}`}>{cat}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredFoods.map((food) => <FoodCard key={food.id} food={food} onAdd={() => handleAdd(food)} />)}
          </div>

          {filteredFoods.length === 0 && <div className="bg-white rounded-3xl p-12 text-center font-black text-gray-500">No food item found.</div>}
        </div>
      </section>
    </>
  );
}

export default Menu;
