import { useState, useEffect, useRef } from "react";
import { getProducts, updateProduct, deleteProduct, uploadImage } from "../../services/api";

const CATEGORIES = [
  "Electronics", "Clothing", "Home & Kitchen",
  "Books", "Sports", "Beauty", "Toys", "Other",
];

const S = {
  toolbar: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    minWidth: "200px",
    height: "46px",
    padding: "0 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    fontSize: "14px",
    background: "#fff",
    outline: "none",
  },
  tableWrap: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    background: "#1e3a8a",
    color: "#fff",
    padding: "14px 16px",
    textAlign: "left",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "0.3px",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f1f5f9",
    color: "#334155",
    verticalAlign: "middle",
  },
  trEven: { background: "#f8fafc" },
  img: {
    width: "48px",
    height: "48px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  imgPlaceholder: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  badge: {
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: "#dbeafe",
    color: "#1d4ed8",
  },
  editBtn: {
    padding: "6px 14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
    marginRight: "6px",
  },
  deleteBtn: {
    padding: "6px 14px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px",
  },
  noData: {
    textAlign: "center",
    padding: "48px",
    color: "#94a3b8",
    fontSize: "16px",
  },

  // Modal overlay
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    background: "#fff",
    borderRadius: "20px",
    padding: "36px",
    width: "100%",
    maxWidth: "560px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "24px",
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
    height: "46px",
    padding: "0 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "14px",
    outline: "none",
  },
  select: {
    width: "100%",
    height: "46px",
    padding: "0 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "14px",
    background: "#fff",
  },
  modalBtns: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  saveBtn: {
    flex: 1,
    height: "48px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    height: "48px",
    background: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default function ManageProducts() {

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editPreview, setEditPreview] = useState("");
  const [editUploading, setEditUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const editFileRef = useRef(null);

  useEffect(() => {
    loadProducts();
  }, []);

  // filter products client-side as user types
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(products);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
        )
      );
    }
  }, [search, products]);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch {
      alert("Failed to load products");
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setEditForm({ ...product });
    setEditPreview(product.imageUrl || "");
  };

  const closeEdit = () => {
    setEditProduct(null);
    setEditForm({});
    setEditPreview("");
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // handle image replacement in edit modal
  const handleEditImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setEditPreview(URL.createObjectURL(file));
    try {
      setEditUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadImage(fd);
      setEditForm((prev) => ({ ...prev, imageUrl: res.data }));
    } catch {
      alert("Image upload failed");
    } finally {
      setEditUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProduct(editProduct.id, {
        ...editForm,
        price: parseFloat(editForm.price),
        stock: parseInt(editForm.stock),
      });
      closeEdit();
      loadProducts();
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <>
      {/* Search bar */}
      <div style={S.toolbar}>
        <input
          style={S.searchInput}
          value={search}
          placeholder="🔍  Search by name or category..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={S.tableWrap}>
        {filtered.length === 0 ? (
          <div style={S.noData}>No products found.</div>
        ) : (
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>#</th>
                <th style={S.th}>Image</th>
                <th style={S.th}>Name</th>
                <th style={S.th}>Category</th>
                <th style={S.th}>Price</th>
                <th style={S.th}>Stock</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={i % 2 !== 0 ? S.trEven : {}}>

                  <td style={S.td}>{i + 1}</td>

                  <td style={S.td}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} style={S.img} />
                    ) : (
                      <div style={S.imgPlaceholder}>📦</div>
                    )}
                  </td>

                  <td style={{ ...S.td, fontWeight: "600" }}>{p.name}</td>

                  <td style={S.td}>
                    <span style={S.badge}>{p.category}</span>
                  </td>

                  <td style={S.td}>₹{p.price?.toFixed(2)}</td>

                  <td style={S.td}>{p.stock}</td>

                  <td style={S.td}>
                    <button style={S.editBtn} onClick={() => openEdit(p)}>Edit</button>
                    <button style={S.deleteBtn} onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div style={S.overlay} onClick={closeEdit}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>

            <div style={S.modalTitle}>✏️ Edit Product</div>

            <label style={S.label}>Product Name</label>
            <input style={S.input} name="name" value={editForm.name || ""} onChange={handleEditChange} />

            <label style={S.label}>Category</label>
            <select style={S.select} name="category" value={editForm.category || ""} onChange={handleEditChange}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={S.label}>Price (₹)</label>
                <input style={S.input} type="number" name="price" value={editForm.price || ""} onChange={handleEditChange} />
              </div>
              <div>
                <label style={S.label}>Stock</label>
                <input style={S.input} type="number" name="stock" value={editForm.stock || ""} onChange={handleEditChange} />
              </div>
            </div>

            <label style={S.label}>Product Image</label>
            <input
              type="file"
              accept="image/*"
              ref={editFileRef}
              style={{ display: "none" }}
              onChange={handleEditImageChange}
            />
            <div
              style={{
                border: "2px dashed #bfdbfe",
                borderRadius: "10px",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                background: "#f0f9ff",
                marginBottom: "14px",
              }}
              onClick={() => editFileRef.current.click()}
            >
              {editPreview ? (
                <>
                  <img src={editPreview} alt="preview" style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "6px", marginBottom: "6px" }} />
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    {editUploading ? "⏳ Uploading..." : "✅ Click to change image"}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: "13px", color: "#64748b" }}>📷 Click to upload image</div>
              )}
            </div>

            <div style={S.modalBtns}>
              <button style={S.saveBtn} onClick={handleSave} disabled={saving || editUploading}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button style={S.cancelBtn} onClick={closeEdit}>Cancel</button>
            </div>

          </div>
        </div>
      )}
    </>
  );

}
