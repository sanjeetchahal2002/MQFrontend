import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!isLoggedIn) navigate("/");
    },
    [isLoggedIn, navigate]
  );
  return isLoggedIn ? children : null;
}
