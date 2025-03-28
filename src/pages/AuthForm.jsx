import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { useAuth } from "../contexts/AuthContext";

import InputField from "../components/InputField";

const API_URL = import.meta.env.VITE_API_URL;

function AuthForm() {
  const [formType, setFormType] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { handleLogin: onLoginSuccess, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleAuth() {
    if (
      !email ||
      !password ||
      (formType === "signup" && (!name || !confirmPassword))
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formType === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        formType === "login"
          ? `${API_URL}api/v1/users/login`
          : `${API_URL}api/v1/users/signup`;

      const data =
        formType === "login"
          ? { email, password }
          : { name, email, password, confirmPassword };

      const result = await axios.post(endpoint, data, {
        withCredentials: true,
      });

      if (result.data.success) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("userData", JSON.stringify(result.data.userData));
        onLoginSuccess();
        setUser(result.data.userData);
        setError(null);
        navigate("/app");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        border: "1px solid black",
        height: "400px",
        width: "500px",
        borderRadius: "30px",
        position: "absolute",
        left: "35%",
        top: "10%",
        boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.4)",
        gap: "20px",
        padding: "20px",
        backgroundColor: "white",
      }}
    >
      <h1>Welcome To Analytics!</h1>
      <h3>
        {formType === "login"
          ? "Welcome Again😍"
          : "🎉 Create a New Account 🎉"}
      </h3>

      {formType === "signup" && (
        <InputField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {formType === "signup" && (
        <InputField
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      )}

      {error && <span style={{ color: "red" }}>{error}</span>}

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={handleAuth} disabled={loading}>
          {loading
            ? "Processing..."
            : formType === "login"
            ? "Login"
            : "Sign Up"}
        </button>
        <button
          onClick={() => setFormType(formType === "login" ? "signup" : "login")}
        >
          {formType === "login" ? "Create Account" : "Back to Login"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
