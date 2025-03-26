import { useState } from "react";
import AuthForm from "./Components/AuthForm";
import Main from "./Components/Main";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!localStorage.getItem("token")
  );
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : {};
  });
  return (
    <div>
      {isLoggedIn ? (
        <Main onLogout={() => setIsLoggedIn(false)} user={user} />
      ) : (
        <AuthForm
          onLoginSuccess={() => setIsLoggedIn(true)}
          setUser={setUser}
        />
      )}
    </div>
  );
}

export default App;
