import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  const notifications =
    JSON.parse(localStorage.getItem(`notifications-${user?.email}`)) || [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-black"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full grid place-items-center">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl p-4 z-50">
          <h3 className="font-black text-lg mb-3">Notifications</h3>

          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications</p>
          ) : (
            notifications.slice().reverse().map((note) => (
              <div
                key={note.id}
                className="bg-orange-50 p-3 rounded-2xl mb-2"
              >
                <p className="font-bold text-gray-800">{note.message}</p>
                <p className="text-xs text-gray-500">{note.time}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;