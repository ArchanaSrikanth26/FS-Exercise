import { useState, useRef } from "react";
import { addProduct, uploadImage } from "../../services/api";

const CATEGORIES = [
  "Electronics", "Clothing", "Home & Kitchen",
  "Books", "Sports", "Beauty", "Toys", "Other",
];

const emptyForm = {
  name: "", description: "", price: "",
  category: "", stock: "",
};

const S = {
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "36px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    maxWidth: "700px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "20px",
  },
  fullRow: { gridColumn: "1 / -1" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    resize: "vertical",
    minHeight: "80px",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    height: "48px",
    padding: "0 14px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "15px",
    background: "#fff",
  },
  // image upload zone
  uploadZone: {
    border: "2px dashed #bfdbfe",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
    cursor: "pointer",
    background: "#f0f9ff",
    transition: "border-color 0.2s",
  },
  uploadZoneActive: {
    borderColor: "#2563eb",
    background: "#eff6ff",
  },
  uploadPreview: {
    width: "100%",
    maxHeight: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  uploadText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
  },
  uploadBtn: {
    padding: "8px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
  },
  uploadingText: {
    fontSize: "13px",
    color: "#2563eb",
    fontWeight: "600",
    marginTop: "8px",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  submitBtn: {
    height: "50px",
    padding: "0 36px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  resetBtn: {
    height: "50px",
    padding: "0 24px",
    background: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  successBanner: {
    background: "#dcfce7",
    border: "1px solid #86efac",
    borderRadius: "12px",
    padding: "14px 18px",
    color: "#15803d",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "24px",
  },
};

export default function AddProduct({ onAdded }) {

  const [form, setForm] = useState(emptyForm);
  const [imageUrl, setImageUrl] = useState(""); // final uploaded URL
  const [previewSrc, setPreviewSrc] = useState(""); // local blob for preview
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // when user picks a file - show preview and upload immediately
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // show local preview right away
    setPreviewSrc(URL.createObjectURL(file));

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadImage(formData);
      // res.data is the URL string returned by backend
      setImageUrl(res.data);
    } catch {
      alert("Image upload failed");
      setPreviewSrc("");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price || !form.category || !form.stock) {
      alert("Name, price, category and stock are required");
      return;
    }

    try {
      setLoading(true);
      await addProduct({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        imageUrl: imageUrl,
      });

      setSuccess(true);
      setForm(emptyForm);
      setImageUrl("");
      setPreviewSrc("");

      setTimeout(() => {
        setSuccess(false);
        onAdded();
      }, 2000);

    } catch (error) {
      alert(error?.response?.data || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setImageUrl("");
    setPreviewSrc("");
  };

  return (
    <div style={S.card}>

      {success && (
        <div style={S.successBanner}>
          ✅ Product added! Redirecting to manage products...
        </div>
      )}

      <div style={S.grid}>

        <div>
          <label style={S.label}>Product Name *</label>
          <input
            style={S.input}
            name="name"
            value={form.name}
            placeholder="e.g. Wireless Headphones"
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={S.label}>Category *</label>
          <select style={S.select} name="category" value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={S.label}>Price (₹) *</label>
          <input style={S.input} type="number" name="price" value={form.price} placeholder="0.00" onChange={handleChange} />
        </div>

        <div>
          <label style={S.label}>Stock Quantity *</label>
          <input style={S.input} type="number" name="stock" value={form.stock} placeholder="0" onChange={handleChange} />
        </div>

        {/* Image Upload */}
        <div style={S.fullRow}>
          <label style={S.label}>Product Image</label>

          {/* hidden file input */}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div
            style={S.uploadZone}
            onClick={() => fileInputRef.current.click()}
          >
            {previewSrc ? (
              <>
                <img src={previewSrc} alt="preview" style={S.uploadPreview} />
                <div style={{ fontSize: "13px", color: "#64748b" }}>
                  {uploading ? "⏳ Uploading..." : imageUrl ? "✅ Uploaded — click to change" : ""}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>📷</div>
                <div style={S.uploadText}>Click to select an image from your computer</div>
                <button
                  style={S.uploadBtn}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
                >
                  Choose Image
                </button>
              </>
            )}
          </div>
        </div>

        <div style={S.fullRow}>
          <label style={S.label}>Description</label>
          <textarea
            style={S.textarea}
            name="description"
            value={form.description}
            placeholder="Short product description..."
            onChange={handleChange}
          />
        </div>

      </div>

      <div style={S.btnRow}>
        <button style={S.submitBtn} onClick={handleSubmit} disabled={loading || uploading}>
          {loading ? "Saving..." : "Add Product"}
        </button>
        <button style={S.resetBtn} onClick={handleReset}>Clear</button>
      </div>

    </div>
  );

}
