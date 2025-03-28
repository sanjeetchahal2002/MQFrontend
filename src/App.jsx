import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AuthForm from "./pages/AuthForm";
import Main from "./pages/Main";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index path="/" element={<AuthForm />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center" }}>
                <h1>🥲Page Not Found 🥲</h1>
              </div>
            }
          ></Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
