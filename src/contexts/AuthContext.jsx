import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const navigate = useNavigate();
  function handleLogout() {
    setIsLoggedIn(false);
    navigate("/");
  }
  function handleLogin() {
    setIsLoggedIn(true);
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        handleLogout,
        handleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export { AuthProvider, useAuth };
