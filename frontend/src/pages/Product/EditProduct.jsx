import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../api";
import "../../css/product/AddProduct.css"; // reuse same glass form style

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    colour: "",
    size: "",
    material: "",
    description: "",
    price: "",
    stock: "",
  });

  // ✅ Load product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setForm(res.data);
        if (res.data.image) {
          setPreview(`http://localhost:5000${res.data.image}`);
        }
      } catch (err) {
        console.error("❌ Failed to load product:", err);
        alert("Product not found.");
        navigate("/view-products");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // ✅ Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        data.append(key, value || "")
      );
      if (image) data.append("image", image);

      await API.put(`/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product updated successfully!");
      navigate("/view-products");
    } catch (err) {
      console.error("❌ Update Error:", err);
      alert("Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container glass-card">
      <h1>✏️ Edit Product</h1>
      <form onSubmit={handleSubmit} className="product-form fade-in">
        {/* Product Title */}
        <label>Product Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label>Brand</label>
        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
        />

        <div className="form-grid">
          <div>
            <label>Colour</label>
            <input
              type="text"
              name="colour"
              value={form.colour}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Size</label>
            <input
              type="text"
              name="size"
              value={form.size}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Material</label>
            <input
              type="text"
              name="material"
              value={form.material}
              onChange={handleChange}
            />
          </div>
        </div>

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
        ></textarea>

        <div className="form-grid">
          <div>
            <label>Price (Rs)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 🖼 Image Section */}
        <label>Product Image</label>
        <div className="image-upload-box">
          {!preview ? (
            <div className="upload-placeholder">
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                onChange={handleImageChange}
              />
              <label htmlFor="imageUpload" className="upload-label">
                <span>📤 Upload Image</span>
              </label>
            </div>
          ) : (
            <div className="preview-box">
              <img src={preview} alt="Product Preview" />
              <label
                className="remove-img-btn"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
              >
                ❌ Remove
              </label>
            </div>
          )}
        </div>

        <div className="tab-actions">
          <button type="button" onClick={() => navigate("/view-products")}>
            ⬅️ Back
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "Updating..." : "💾 Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
