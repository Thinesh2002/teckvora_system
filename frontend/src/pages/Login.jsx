import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../css/login.css"; 

export default function Login() {
  const [form, setForm] = useState({ emailOrId: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = form.emailOrId.includes("@")
        ? { email: form.emailOrId, password: form.password }
        : { user_id: form.emailOrId, password: form.password };

      const res = await API.post("/auth/login", payload);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Sign in to your account</p>
        <form onSubmit={handleSubmit}>
          <input
            name="emailOrId"
            placeholder="Email or User ID"
            value={form.emailOrId}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p className="link-text">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
