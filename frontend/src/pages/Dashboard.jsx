import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../css/dashbord.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/");
      });
  }, []);


  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 400, margin: "80px auto" }}>
      <h2>Welcome, {user.name || user.user_id}</h2>
      <p>Email: {user.email}</p>
      <p>User ID: {user.user_id}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
