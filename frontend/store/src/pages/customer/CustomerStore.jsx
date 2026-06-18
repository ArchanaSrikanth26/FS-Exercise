import { useState, useEffect } from "react";
import { getProducts, placeOrder, getOrdersByUser } from "../../services/api";

const CATEGORIES = ["All","Electronics","Clothing","Home & Kitchen","Books","Sports","Beauty","Toys","Other"];

// ── shared style tokens ─────────────────────────────────────
const C = {
  blue: "#2563eb",
  dark: "#0f172a",
  navy: "#1e3a8a",
  slate: "#64748b",
  light: "#f1f5f9",
  white: "#fff",
  green: "#15803d",
  greenBg: "#dcfce7",
  red: "#dc2626",
  redBg: "#fee2e2",
};

// ── Main Component ──────────────────────────────────────────
export default function CustomerStore({ user, onLogout }) {

  const [view, setView] = useState("shop"); // "shop" | "cart" | "checkout" | "orders"
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // cart: array of { product, quantity }
  const [cart, setCart] = useState([]);

  useEffect(() => { loadProducts(); }, []);

  useEffect(() => {
    let result = [...products];
    if (category !== "All") result = result.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [search, category, products]);

  const loadProducts = async () => {
    try { const r = await getProducts(); setProducts(r.data); }
    catch { alert("Failed to load products"); }
  };

  // add to cart or increase qty
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity: qty } : i));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  if (view === "cart") return (
    <CartPage
      cart={cart} cartTotal={cartTotal}
      onUpdateQty={updateQty} onRemove={removeFromCart}
      onCheckout={() => setView("checkout")}
      onBack={() => setView("shop")}
      user={user} onLogout={onLogout} cartCount={cartCount}
      onOrders={() => setView("orders")}
    />
  );

  if (view === "checkout") return (
    <CheckoutPage
      cart={cart} cartTotal={cartTotal}
      user={user}
      onSuccess={() => { setCart([]); setView("orders"); }}
      onBack={() => setView("cart")}
      onLogout={onLogout} cartCount={cartCount}
      onOrders={() => setView("orders")}
    />
  );

  if (view === "orders") return (
    <OrderHistoryPage
      user={user} onLogout={onLogout} cartCount={cartCount}
      onShop={() => setView("shop")}
      onCart={() => setView("cart")}
    />
  );

  // default: shop view
  return (
    <div style={{ minHeight: "100vh", background: C.light }}>

      <Navbar user={user} onLogout={onLogout} cartCount={cartCount}
        onCart={() => setView("cart")} onOrders={() => setView("orders")} active="shop" />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 24px" }}>

        {/* Filter bar */}
        <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", alignItems:"center",
          background:C.white, borderRadius:"16px", padding:"14px 20px",
          boxShadow:"0 2px 8px rgba(0,0,0,.06)", marginBottom:"24px" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="🔍  Search products..."
            style={{ flex:1, minWidth:"200px", height:"44px", padding:"0 16px",
              border:"1.5px solid #e2e8f0", borderRadius:"10px", fontSize:"14px", outline:"none" }} />
          <select value={category} onChange={e=>setCategory(e.target.value)}
            style={{ height:"44px", padding:"0 16px", border:"1.5px solid #e2e8f0",
              borderRadius:"10px", fontSize:"14px", background:C.white, minWidth:"180px" }}>
            {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          {(search||category!=="All") && (
            <button onClick={()=>{setSearch("");setCategory("All");}}
              style={{ height:"44px", padding:"0 18px", background:C.light, border:"none",
                borderRadius:"10px", color:C.slate, fontWeight:"600", fontSize:"14px", cursor:"pointer" }}>
              Clear
            </button>
          )}
          <span style={{ color:C.slate, fontSize:"14px", fontWeight:"600" }}>
            {filtered.length} product{filtered.length!==1?"s":""}
          </span>
        </div>

        <div style={{ fontSize:"20px", fontWeight:"800", color:C.dark, marginBottom:"18px" }}>
          {category==="All"?"All Products":category}
        </div>

        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"80px", color:"#94a3b8", fontSize:"18px" }}>
            😔 No products found.
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:"20px" }}>
            {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={()=>addToCart(p)} />)}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Shared Navbar ───────────────────────────────────────────
function Navbar({ user, onLogout, cartCount, onCart, onOrders, active }) {
  const navBtn = (label, onClick, isActive) => (
    <button onClick={onClick} style={{
      padding: "8px 16px", border: "none", borderRadius: "8px", cursor: "pointer",
      fontSize: "13px", fontWeight: "700",
      background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
      color: "#fff",
    }}>{label}</button>
  );

  return (
    <nav style={{
      background: "linear-gradient(90deg,#0f172a,#1e3a8a)",
      height: "64px", padding: "0 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      position: "sticky", top: 0, zIndex: 200,
      boxShadow: "0 2px 12px rgba(0,0,0,.2)",
    }}>
      <div style={{ fontSize: "20px", fontWeight: "800", color: "#fff" }}>🛍 ShopZone</div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {navBtn("🏪 Shop", onCart ? () => {} : undefined, active === "shop")}
        {navBtn("📋 Orders", onOrders, active === "orders")}
        <button onClick={onCart} style={{
          position: "relative", padding: "8px 16px", border: "none",
          borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700",
          background: active === "cart" ? "rgba(255,255,255,0.2)" : "transparent", color: "#fff",
        }}>
          🛒 Cart
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: "2px", right: "2px",
              background: "#ef4444", color: "#fff", borderRadius: "50%",
              width: "18px", height: "18px", fontSize: "10px", fontWeight: "800",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{cartCount}</span>
          )}
        </button>
        <span style={{ color: "#93c5fd", fontSize: "13px", fontWeight: "600", marginLeft: "8px" }}>
          👋 {user?.name}
        </span>
        <button onClick={onLogout} style={{
          padding: "7px 14px", background: "rgba(239,68,68,0.15)",
          border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px",
          color: "#fca5a5", fontSize: "13px", fontWeight: "600", cursor: "pointer",
        }}>Sign Out</button>
      </div>
    </nav>
  );
}

// ── Product Card ────────────────────────────────────────────
function ProductCard({ product, onAdd }) {
  const [hovered, setHovered] = useState(false);
  const outOfStock = !product.stock || product.stock < 1;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.white, borderRadius: "16px", overflow: "hidden",
        boxShadow: hovered ? "0 12px 28px rgba(0,0,0,.12)" : "0 2px 10px rgba(0,0,0,.06)",
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "all 0.2s", display: "flex", flexDirection: "column",
      }}
    >
      {/* image */}
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name}
          style={{ width: "100%", height: "200px", objectFit: "cover" }} />
      ) : (
        <div style={{
          width: "100%", height: "200px",
          background: "linear-gradient(135deg,#dbeafe,#eff6ff)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "52px",
        }}>📦</div>
      )}

      <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <span style={{
          display: "inline-block", padding: "3px 10px", background: "#dbeafe",
          color: C.blue, borderRadius: "20px", fontSize: "11px", fontWeight: "700", marginBottom: "8px",
        }}>{product.category}</span>

        <div style={{ fontSize: "15px", fontWeight: "700", color: C.dark, marginBottom: "4px", lineHeight: "1.3" }}>
          {product.name}
        </div>

        {product.description && (
          <div style={{
            fontSize: "12px", color: C.slate, marginBottom: "10px", lineHeight: "1.4",
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>{product.description}</div>
        )}

        <div style={{ marginTop: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "20px", fontWeight: "800", color: C.blue }}>
              ₹{product.price?.toFixed(2)}
            </span>
            <span style={{
              fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px",
              background: outOfStock ? C.redBg : C.greenBg,
              color: outOfStock ? C.red : C.green,
            }}>
              {outOfStock ? "Out of Stock" : `Stock: ${product.stock}`}
            </span>
          </div>

          <button
            onClick={onAdd}
            disabled={outOfStock}
            style={{
              width: "100%", height: "42px", border: "none", borderRadius: "10px",
              background: outOfStock ? "#e2e8f0" : C.blue,
              color: outOfStock ? "#94a3b8" : C.white,
              fontSize: "14px", fontWeight: "700", cursor: outOfStock ? "not-allowed" : "pointer",
            }}
          >
            {outOfStock ? "Unavailable" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cart Page ───────────────────────────────────────────────
function CartPage({ cart, cartTotal, onUpdateQty, onRemove, onCheckout, onBack, user, onLogout, cartCount, onOrders }) {
  return (
    <div style={{ minHeight: "100vh", background: C.light }}>
      <Navbar user={user} onLogout={onLogout} cartCount={cartCount}
        onCart={onBack} onOrders={onOrders} active="cart" />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={onBack} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "14px", color: C.blue, fontWeight: "600",
          }}>← Continue Shopping</button>
          <span style={{ fontSize: "24px", fontWeight: "800", color: C.dark }}>Your Cart</span>
        </div>

        {cart.length === 0 ? (
          <div style={{
            background: C.white, borderRadius: "20px", padding: "60px",
            textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.06)",
          }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🛒</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: C.dark, marginBottom: "8px" }}>Your cart is empty</div>
            <div style={{ color: C.slate, marginBottom: "24px" }}>Add some products to get started</div>
            <button onClick={onBack} style={{
              padding: "12px 28px", background: C.blue, color: C.white,
              border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer",
            }}>Browse Products</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px" }}>

            {/* Cart items */}
            <div style={{ background: C.white, borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
              {cart.map(({ product, quantity }) => (
                <div key={product.id} style={{
                  display: "flex", gap: "16px", paddingBottom: "20px", marginBottom: "20px",
                  borderBottom: "1px solid #f1f5f9", alignItems: "center",
                }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name}
                      style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: "80px", height: "80px", borderRadius: "10px",
                      background: "#f1f5f9", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: "28px", flexShrink: 0,
                    }}>📦</div>
                  )}

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", color: C.dark, marginBottom: "4px" }}>{product.name}</div>
                    <div style={{ fontSize: "13px", color: C.slate, marginBottom: "10px" }}>{product.category}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <button onClick={() => onUpdateQty(product.id, quantity - 1)} style={qtyBtnStyle}>−</button>
                      <span style={{ fontWeight: "700", fontSize: "15px", minWidth: "24px", textAlign: "center" }}>{quantity}</span>
                      <button onClick={() => onUpdateQty(product.id, quantity + 1)} style={qtyBtnStyle}>+</button>
                      <button onClick={() => onRemove(product.id)} style={{
                        marginLeft: "8px", background: "none", border: "none",
                        color: C.red, cursor: "pointer", fontSize: "13px", fontWeight: "600",
                      }}>Remove</button>
                    </div>
                  </div>

                  <div style={{ fontSize: "18px", fontWeight: "800", color: C.blue, flexShrink: 0 }}>
                    ₹{(product.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div style={{ background: C.white, borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", height: "fit-content" }}>
              <div style={{ fontSize: "18px", fontWeight: "800", color: C.dark, marginBottom: "20px" }}>Order Summary</div>
              {cart.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "13px", color: C.slate }}>
                  <span>{product.name} × {quantity}</span>
                  <span style={{ fontWeight: "600", color: C.dark }}>₹{(product.price * quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: "14px", marginTop: "8px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "800", fontSize: "16px", color: C.dark }}>Total</span>
                <span style={{ fontWeight: "800", fontSize: "20px", color: C.blue }}>₹{cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={onCheckout} style={{
                width: "100%", height: "50px", background: C.blue, color: C.white,
                border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "700",
                cursor: "pointer", marginTop: "20px",
              }}>Proceed to Checkout →</button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

const qtyBtnStyle = {
  width: "30px", height: "30px", border: "1.5px solid #e2e8f0", borderRadius: "8px",
  background: C.light, cursor: "pointer", fontSize: "16px", fontWeight: "700", color: C.dark,
};

// ── Checkout Page ────────────────────────────────────────────
function CheckoutPage({ cart, cartTotal, user, onSuccess, onBack, onLogout, cartCount, onOrders }) {
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [placing, setPlacing] = useState(false);

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handlePlace = async () => {
    if (!address.street.trim() || !address.city.trim() || !address.pincode.trim()) {
      alert("Please fill in your delivery address");
      return;
    }

    try {
      setPlacing(true);
      await placeOrder({
        userId: user.id,
        customerName: user.name,
        items: cart.map(({ product, quantity }) => ({
          productId: product.id,
          productName: product.name,
          productImage: product.imageUrl || "",
          price: product.price,
          quantity,
        })),
      });
      onSuccess();
    } catch {
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const field = (label, name, placeholder) => (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>{label}</label>
      <input
        name={name} value={address[name]} onChange={handleChange}
        placeholder={placeholder}
        style={{ width: "100%", height: "48px", padding: "0 14px", border: "1.5px solid #e2e8f0",
          borderRadius: "10px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.light }}>
      <Navbar user={user} onLogout={onLogout} cartCount={cartCount}
        onCart={onBack} onOrders={onOrders} active="checkout" />

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: C.blue, fontWeight: "600" }}>
            ← Back to Cart
          </button>
          <span style={{ fontSize: "24px", fontWeight: "800", color: C.dark }}>Checkout</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>

          {/* Delivery details */}
          <div style={{ background: C.white, borderRadius: "20px", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: "17px", fontWeight: "800", color: C.dark, marginBottom: "20px" }}>📦 Delivery Address</div>
            {field("Street / House No.", "street", "123, Main Street")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>{field("City", "city", "Chennai")}</div>
              <div>{field("State", "state", "Tamil Nadu")}</div>
            </div>
            {field("Pincode", "pincode", "600001")}

            <div style={{ background: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: "12px", padding: "14px 16px", marginTop: "8px" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: C.blue, marginBottom: "4px" }}>👤 Customer Details</div>
              <div style={{ fontSize: "13px", color: C.slate }}>{user?.name} · {user?.email}</div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div style={{ background: C.white, borderRadius: "20px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", marginBottom: "16px" }}>
              <div style={{ fontSize: "17px", fontWeight: "800", color: C.dark, marginBottom: "16px" }}>Order Summary</div>
              {cart.map(({ product, quantity }) => (
                <div key={product.id} style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "center" }}>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name}
                      style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: "48px", height: "48px", borderRadius: "8px", background: "#f1f5f9",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>📦</div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "600", color: C.dark }}>{product.name}</div>
                    <div style={{ fontSize: "12px", color: C.slate }}>Qty: {quantity}</div>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: C.blue }}>₹{(product.price * quantity).toFixed(2)}</div>
                </div>
              ))}
              <div style={{ borderTop: "2px solid #f1f5f9", paddingTop: "14px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: "800", color: C.dark }}>Total</span>
                <span style={{ fontWeight: "800", fontSize: "20px", color: C.blue }}>₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handlePlace} disabled={placing} style={{
              width: "100%", height: "54px", background: placing ? "#93c5fd" : C.blue,
              color: C.white, border: "none", borderRadius: "14px",
              fontSize: "16px", fontWeight: "800", cursor: placing ? "not-allowed" : "pointer",
            }}>
              {placing ? "Placing Order..." : "✅ Place Order"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Order History Page ──────────────────────────────────────
function OrderHistoryPage({ user, onLogout, cartCount, onShop, onCart }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // which order is expanded

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await getOrdersByUser(user.id);
      setOrders(res.data);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    if (status === "PLACED") return { bg: "#fef9c3", text: "#ca8a04" };
    if (status === "CONFIRMED") return { bg: "#dbeafe", text: C.blue };
    if (status === "DELIVERED") return { bg: C.greenBg, text: C.green };
    return { bg: C.light, text: C.slate };
  };

  const formatDate = (dt) => {
    if (!dt) return "";
    return new Date(dt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.light }}>
      <Navbar user={user} onLogout={onLogout} cartCount={cartCount}
        onCart={onCart} onOrders={() => {}} active="orders" />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <span style={{ fontSize: "24px", fontWeight: "800", color: C.dark }}>📋 Order History</span>
          <button onClick={onShop} style={{
            padding: "10px 22px", background: C.blue, color: C.white,
            border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer",
          }}>Continue Shopping</button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: C.slate, fontSize: "16px" }}>Loading orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ background: C.white, borderRadius: "20px", padding: "60px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📦</div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: C.dark, marginBottom: "8px" }}>No orders yet</div>
            <div style={{ color: C.slate, marginBottom: "24px" }}>Your order history will appear here</div>
            <button onClick={onShop} style={{
              padding: "12px 28px", background: C.blue, color: C.white,
              border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "700", cursor: "pointer",
            }}>Shop Now</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order) => {
              const sc = statusColor(order.status);
              const isOpen = expanded === order.id;

              return (
                <div key={order.id} style={{ background: C.white, borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,.06)", overflow: "hidden" }}>

                  {/* Order header - click to expand */}
                  <div
                    onClick={() => setExpanded(isOpen ? null : order.id)}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "20px 24px", cursor: "pointer" }}
                  >
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "800", color: C.dark, marginBottom: "4px" }}>
                        Order #{order.id}
                      </div>
                      <div style={{ fontSize: "13px", color: C.slate }}>{formatDate(order.orderDate)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "18px", fontWeight: "800", color: C.blue }}>₹{order.totalAmount?.toFixed(2)}</div>
                        <div style={{ fontSize: "12px", color: C.slate }}>{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</div>
                      </div>
                      <span style={{ padding: "5px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: sc.bg, color: sc.text }}>
                        {order.status}
                      </span>
                      <span style={{ color: C.slate, fontSize: "18px" }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                  </div>

                  {/* Expanded items */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #f1f5f9", padding: "16px 24px 20px" }}>
                      {order.items?.map((item) => (
                        <div key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center", marginBottom: "14px" }}>
                          {item.productImage ? (
                            <img src={item.productImage} alt={item.productName}
                              style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: "56px", height: "56px", borderRadius: "10px", background: "#f1f5f9",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>📦</div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600", color: C.dark, fontSize: "14px" }}>{item.productName}</div>
                            <div style={{ fontSize: "13px", color: C.slate }}>Qty: {item.quantity} × ₹{item.price?.toFixed(2)}</div>
                          </div>
                          <div style={{ fontSize: "15px", fontWeight: "700", color: C.blue }}>
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", justifyContent: "flex-end" }}>
                        <span style={{ fontWeight: "800", fontSize: "16px", color: C.dark }}>
                          Total: <span style={{ color: C.blue }}>₹{order.totalAmount?.toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
