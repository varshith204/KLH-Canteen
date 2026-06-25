function FoodCard({ food, onAdd }) {
  return (
    <div className="bg-white rounded-[30px] shadow-xl overflow-hidden hover:-translate-y-2 transition border border-orange-100">
      <div className="relative h-56 overflow-hidden">
        <img src={food.image} alt={food.name} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
        <span className="absolute top-4 left-4 bg-white/90 px-4 py-2 rounded-full font-black text-orange-600">{food.category}</span>
        <span className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full font-black">⭐ {food.rating}</span>
      </div>
      <div className="p-6">
        <div className="flex justify-between gap-4 items-start">
          <h2 className="text-2xl font-black text-gray-900">{food.name}</h2>
          <p className="text-2xl font-black text-orange-600">₹{food.price}</p>
        </div>
        <p className="text-gray-500 mt-3 min-h-[48px]">{food.description}</p>
        <div className="flex justify-between items-center mt-5">
          <span className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full font-bold">⏱ {food.time} mins</span>
          <button onClick={onAdd} className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition">Add +</button>
        </div>
      </div>
    </div>
  );
}

export default FoodCard;
