import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "../../css/product/ProductDashboard.css";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const navigate = useNavigate();

  // ✅ Normalize image path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.png";
    let path = imagePath.replace(/\\/g, "/");
    if (!path.startsWith("/")) path = "/" + path;
    return `http://localhost:5000${path}`;
  };

  // ✅ Fetch products
  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      alert("Failed to load products. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      alert("🗑️ Product deleted!");
      loadProducts();
    } catch (err) {
      console.error("❌ Delete Error:", err);
      alert("Failed to delete product!");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="dashboard">
      <div className="header-row">
        <h1>📦 Product List</h1>
        <button className="add-btn" onClick={() => navigate("/add-product")}>
          ➕ Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found. Add one to get started!</p>
      ) : (
        <div className="glass-card fade-in">
          <table className="product-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <img
                      src={getImageUrl(p.image)}
                      alt={p.title}
                      className="thumb"
                      onClick={() => setZoomedImage(getImageUrl(p.image))}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/placeholder.png";
                      }}
                    />
                  </td>
                  <td>{p.title}</td>
                  <td>Rs {p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => setSelectedProduct(p)}>👁️ View</button>
                    <button onClick={() => navigate(`/edit-product/${p.id}`)}>
                      ✏️ Edit
                    </button>
                    <button onClick={() => deleteProduct(p.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🪟 Product View Modal */}
      {selectedProduct && (
        <div className="modal" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedProduct(null)}
            >
              ✖
            </button>
            <h2>{selectedProduct.title}</h2>
            <img
              src={getImageUrl(selectedProduct.image)}
              alt={selectedProduct.title}
              className="thumb-large"
              onClick={() =>
                setZoomedImage(getImageUrl(selectedProduct.image))
              }
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder.png";
              }}
            />
            <p>
              <strong>Brand:</strong> {selectedProduct.brand}
            </p>
            <p>
              <strong>Colour:</strong> {selectedProduct.colour}
            </p>
            <p>
              <strong>Size:</strong> {selectedProduct.size}
            </p>
            <p>
              <strong>Material:</strong> {selectedProduct.material}
            </p>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Price:</strong> Rs {selectedProduct.price}
            </p>
            <p>
              <strong>Stock:</strong> {selectedProduct.stock}
            </p>
          </div>
        </div>
      )}

      {/* 🖼️ Zoomed Image Overlay */}
      {zoomedImage && (
        <div
          className="image-zoom-overlay"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="image-zoomed"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
