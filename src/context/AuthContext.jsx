import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const STUDENT_DOMAIN = "@klh.edu.in";
const ADMIN_EMAIL = "admin@klh.edu.in";
const ADMIN_PASSWORD = "admin123";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const login = (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, message: "Please enter both email and password." };
    }

    if (!cleanEmail.endsWith(STUDENT_DOMAIN)) {
      return { success: false, message: "Only KLH college email is allowed." };
    }

    if (cleanEmail === ADMIN_EMAIL) {
      if (cleanPassword !== ADMIN_PASSWORD) {
        return { success: false, message: "Incorrect admin password." };
      }

      const adminData = { email: cleanEmail, role: "admin", name: "Canteen Admin" };
      setUser(adminData);
      localStorage.setItem("user", JSON.stringify(adminData));
      return { success: true, role: "admin" };
    }

    if (cleanPassword.length < 4) {
      return { success: false, message: "Student password must be at least 4 characters." };
    }

    const name = cleanEmail.split("@")[0].replace(/[._]/g, " ");
    const userData = { email: cleanEmail, role: "user", name };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    return { success: true, role: "user" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
