import { useState } from "react";
import { signup } from "../services/api";

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
    padding: "20px",
  },
  card: {
    width: "480px",
    background: "#fff",
    borderRadius: "24px",
    padding: "48px 40px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "6px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "32px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    height: "50px",
    padding: "0 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    marginBottom: "20px",
  },
  select: {
    width: "100%",
    height: "50px",
    padding: "0 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    marginBottom: "20px",
    background: "#fff",
    cursor: "pointer",
  },
  btn: {
    width: "100%",
    height: "52px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "16px",
  },
  backBtn: {
    width: "100%",
    height: "46px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    background: "transparent",
    color: "#64748b",
  },
};

export default function SignupPage({ onSuccess, onBack }) {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await signup(form);
      alert("Account created! Please login.");
      onSuccess();
    } catch (error) {
      alert(error?.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={S.page}>
      <div style={S.card}>

        <h1 style={S.title}>Create Account</h1>
        <p style={S.subtitle}>Join ShopZone today</p>

        <label style={S.label}>Full Name</label>
        <input
          style={S.input}
          name="name"
          value={form.name}
          placeholder="John Doe"
          onChange={handleChange}
        />

        <label style={S.label}>Email Address</label>
        <input
          style={S.input}
          type="email"
          name="email"
          value={form.email}
          placeholder="you@example.com"
          onChange={handleChange}
        />

        <label style={S.label}>Password</label>
        <input
          style={S.input}
          type="password"
          name="password"
          value={form.password}
          placeholder="Choose a password"
          onChange={handleChange}
        />

        <label style={S.label}>Account Type</label>
        <select
          style={S.select}
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          style={S.btn}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <button style={S.backBtn} onClick={onBack}>
          ← Back
        </button>

      </div>
    </div>
  );

}
