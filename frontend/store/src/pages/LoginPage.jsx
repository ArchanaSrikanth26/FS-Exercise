import { useState } from "react";
import { login } from "../services/api";

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
    width: "440px",
    background: "#fff",
    borderRadius: "24px",
    padding: "48px 40px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  badge: {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "20px",
    letterSpacing: "0.5px",
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
    outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    color: "#fff",
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
  signupRow: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#64748b",
  },
  link: {
    color: "#2563eb",
    fontWeight: "700",
    cursor: "pointer",
    marginLeft: "4px",
  },
};

export default function LoginPage({ hint, onSuccess, onBack, onSignup }) {

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const isAdmin = hint === "ADMIN";

  const accentColor = isAdmin ? "#7c3aed" : "#2563eb";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {

    if (!form.email.trim() || !form.password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await login(form);
      const user = res.data;

      // validate role matches what the user clicked on landing
      if (hint && user.role !== hint) {
        alert(`This account is a ${user.role}. Please use the correct login option.`);
        return;
      }

      onSuccess(user);

    } catch (error) {
      alert(error?.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={S.page}>
      <div style={S.card}>

        <span style={{
          ...S.badge,
          background: isAdmin ? "#f3e8ff" : "#dbeafe",
          color: accentColor,
        }}>
          {isAdmin ? "🛠 ADMIN LOGIN" : "🛒 CUSTOMER LOGIN"}
        </span>

        <h1 style={S.title}>Welcome Back</h1>
        <p style={S.subtitle}>
          Sign in to your {isAdmin ? "admin" : "customer"} account
        </p>

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
          placeholder="Enter password"
          onChange={handleChange}
        />

        <button
          style={{ ...S.btn, background: accentColor }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <button style={S.backBtn} onClick={onBack}>
          ← Back
        </button>

        <div style={S.signupRow}>
          New here?
          <span style={{ ...S.link, color: accentColor }} onClick={onSignup}>
            Create an account
          </span>
        </div>

      </div>
    </div>
  );

}
