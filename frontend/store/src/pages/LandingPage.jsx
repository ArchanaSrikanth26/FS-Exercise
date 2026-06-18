// LandingPage - first screen with two login options

const S = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #3b82f6 100%)",
    padding: "20px",
  },
  logo: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#fff",
    letterSpacing: "-1px",
    marginBottom: "8px",
  },
  tagline: {
    color: "#93c5fd",
    fontSize: "16px",
    marginBottom: "60px",
  },
  cardsRow: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "40px",
  },
  card: {
    width: "260px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "24px",
    padding: "40px 30px",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s, background 0.2s",
  },
  cardHover: {
    background: "rgba(255,255,255,0.15)",
    transform: "translateY(-4px)",
  },
  icon: {
    fontSize: "52px",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "8px",
  },
  cardSub: {
    fontSize: "14px",
    color: "#93c5fd",
    lineHeight: "1.5",
  },
  divider: {
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    marginBottom: "20px",
  },
  signupBtn: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.4)",
    color: "#fff",
    padding: "12px 32px",
    borderRadius: "12px",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default function LandingPage({ onLoginAsAdmin, onLoginAsCustomer, onSignup }) {

  return (
    <div style={S.page}>

      <div style={S.logo}>🛍 ShopZone</div>
      <p style={S.tagline}>Your one-stop online store</p>

      <div style={S.cardsRow}>

        {/* Admin card */}
        <div
          style={S.card}
          onClick={onLoginAsAdmin}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, S.cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: S.card.background, transform: "none" })}
        >
          <div style={S.icon}>🛠</div>
          <div style={S.cardTitle}>Login as Admin</div>
          <div style={S.cardSub}>Manage products, inventory and your store catalog</div>
        </div>

        {/* Customer card */}
        <div
          style={S.card}
          onClick={onLoginAsCustomer}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, S.cardHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: S.card.background, transform: "none" })}
        >
          <div style={S.icon}>🛒</div>
          <div style={S.cardTitle}>Login as Customer</div>
          <div style={S.cardSub}>Browse products, explore categories and shop freely</div>
        </div>

      </div>

      <div style={S.divider}>Don't have an account?</div>
      <button style={S.signupBtn} onClick={onSignup}>
        Create Account
      </button>

    </div>
  );

}
