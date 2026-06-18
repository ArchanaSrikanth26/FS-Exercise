import { useState } from "react";
import AddProduct from "./AddProduct";
import ManageProducts from "./ManageProducts";

/*
  Admin layout:
  ┌──────────┬────────────────────────────────┐
  │ Sidebar  │  Main content area             │
  │          │  (switches based on activeMenu)│
  └──────────┴────────────────────────────────┘
*/

const MENU = [
  { key: "dashboard", icon: "📊", label: "Dashboard" },
  { key: "add",       icon: "➕", label: "Add Product" },
  { key: "manage",    icon: "📦", label: "Manage Products" },
];

const S = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9",
  },

  // ── Sidebar ──
  sidebar: {
    width: "260px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: "32px 24px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  brandName: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#fff",
    marginBottom: "2px",
  },
  brandSub: {
    fontSize: "12px",
    color: "#93c5fd",
  },
  nav: {
    padding: "16px 12px",
    flex: 1,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 16px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "4px",
    transition: "all 0.15s",
  },
  menuItemActive: {
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  menuIcon: {
    fontSize: "18px",
    width: "24px",
    textAlign: "center",
  },
  sidebarFooter: {
    padding: "20px 16px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  userInfo: {
    fontSize: "13px",
    color: "#93c5fd",
    marginBottom: "12px",
  },
  logoutBtn: {
    width: "100%",
    padding: "10px",
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "10px",
    color: "#fca5a5",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  // ── Main ──
  main: {
    flex: 1,
    padding: "32px",
    overflow: "auto",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
  },
  pageTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#0f172a",
  },
  welcomeBadge: {
    background: "#dbeafe",
    color: "#1d4ed8",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  // Dashboard stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "28px",
  },
  statCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  },
  statLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "600",
    marginBottom: "8px",
  },
  statValue: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
  },
  statIcon: {
    fontSize: "28px",
    marginBottom: "12px",
  },
};

export default function AdminDashboard({ user, onLogout }) {

  const [activeMenu, setActiveMenu] = useState("dashboard");

  const renderContent = () => {
    if (activeMenu === "add") {
      return <AddProduct onAdded={() => setActiveMenu("manage")} />;
    }
    if (activeMenu === "manage") {
      return <ManageProducts />;
    }
    // Dashboard overview
    return <DashboardHome onNavigate={setActiveMenu} />;
  };

  const pageTitles = {
    dashboard: "Dashboard",
    add: "Add New Product",
    manage: "Manage Products",
  };

  return (
    <div style={S.layout}>

      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>

        <div style={S.sidebarHeader}>
          <div style={S.brandName}>🛍 ShopZone</div>
          <div style={S.brandSub}>Admin Panel</div>
        </div>

        <nav style={S.nav}>
          {MENU.map((item) => (
            <div
              key={item.key}
              style={{
                ...S.menuItem,
                ...(activeMenu === item.key ? S.menuItemActive : {}),
              }}
              onClick={() => setActiveMenu(item.key)}
            >
              <span style={S.menuIcon}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        <div style={S.sidebarFooter}>
          <div style={S.userInfo}>Signed in as<br /><strong style={{ color: "#fff" }}>{user?.name}</strong></div>
          <button style={S.logoutBtn} onClick={onLogout}>
            Sign Out
          </button>
        </div>

      </aside>

      {/* ── Main Content ── */}
      <main style={S.main}>

        <div style={S.topBar}>
          <h1 style={S.pageTitle}>{pageTitles[activeMenu]}</h1>
          <span style={S.welcomeBadge}>👋 {user?.name}</span>
        </div>

        {renderContent()}

      </main>

    </div>
  );

}

// ── Dashboard home with quick-action cards ──────────────────
function DashboardHome({ onNavigate }) {

  return (
    <>
      <div style={S.statsGrid}>

        <div style={S.statCard}>
          <div style={S.statIcon}>📦</div>
          <div style={S.statLabel}>TOTAL PRODUCTS</div>
          <div style={S.statValue}>—</div>
        </div>

        <div style={S.statCard}>
          <div style={S.statIcon}>🏷</div>
          <div style={S.statLabel}>CATEGORIES</div>
          <div style={S.statValue}>—</div>
        </div>

        <div style={S.statCard}>
          <div style={S.statIcon}>✅</div>
          <div style={S.statLabel}>IN STOCK</div>
          <div style={S.statValue}>—</div>
        </div>

      </div>

      <div style={{ display: "flex", gap: "16px" }}>

        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            cursor: "pointer",
            border: "2px dashed #bfdbfe",
          }}
          onClick={() => onNavigate("add")}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>➕</div>
          <div style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
            Add New Product
          </div>
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            Create a new product listing for your store
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: "#fff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            cursor: "pointer",
            border: "2px dashed #bfdbfe",
          }}
          onClick={() => onNavigate("manage")}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📋</div>
          <div style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", marginBottom: "6px" }}>
            Manage Products
          </div>
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            Edit, update or remove existing products
          </div>
        </div>

      </div>
    </>
  );

}
