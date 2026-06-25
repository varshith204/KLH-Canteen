 function OrderTracker({ status }) {
  const steps = ["Preparing", "Ready", "Collected"];
  const currentIndex = steps.indexOf(status);

  return (
    <div className="mt-5">
      <div className="flex items-center gap-3">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={
                index <= currentIndex
                  ? "w-10 h-10 rounded-full bg-green-500 text-white grid place-items-center font-black"
                  : "w-10 h-10 rounded-full bg-gray-200 text-gray-500 grid place-items-center font-black"
              }
            >
              {index <= currentIndex ? "✓" : index + 1}
            </div>

            <span
              className={
                index <= currentIndex
                  ? "font-black text-green-600"
                  : "font-bold text-gray-400"
              }
            >
              {step}
            </span>

            {index !== steps.length - 1 && (
              <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderTracker;