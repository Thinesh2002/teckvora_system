import React, { useState } from "react";
import API from "../api";

export default function DarazTitleGenerator() {
  const [form, setForm] = useState({
    productName: "",
    colour: "",
    size: "",
    material: "",
    pack: "",
    keyFeatures: "",
  });
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generatePrompt = () => `
Product Name: ${form.productName}
Colour: ${form.colour}
Size: ${form.size}
Material: ${form.material}
Pack: ${form.pack}
Key Features: ${form.keyFeatures}
`.trim();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setTitles([]);
    setLoading(true);

    try {
      const res = await API.post("/ai/generate-title", {
        name: generatePrompt(),
        market: "lk",
      });
      if (res.data.titles?.length) setTitles(res.data.titles);
      else setError("⚠️ No titles generated. Try rephrasing product details.");
    } catch (err) {
      console.error(err);
      setError("❌ Failed to connect with AI title generator.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    const toast = document.createElement("div");
    toast.textContent = "✅ Copied to Clipboard!";
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#00d47e",
      color: "#000",
      padding: "10px 16px",
      borderRadius: "8px",
      fontWeight: "bold",
      zIndex: 9999,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      animation: "fadeInOut 2.5s ease",
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const charColor = (len) => {
    if (len < 90) return "#ff5b5b";
    if (len > 120) return "#ffaa00";
    return "#00d47e";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛍️ Daraz LK Title Generator</h2>
      <p style={styles.subtext}>
        Generate SEO-optimized product titles for Daraz (Sri Lanka)
      </p>

      <form onSubmit={handleGenerate} style={styles.form}>
        <div style={styles.grid}>
          <Field
            label="Product Name"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="Ex: LED Ceiling Light"
            required
          />
          <Field
            label="Colour"
            name="colour"
            value={form.colour}
            onChange={handleChange}
            placeholder="Ex: Warm White"
          />
          <Field
            label="Size"
            name="size"
            value={form.size}
            onChange={handleChange}
            placeholder="Ex: 30cm / 18W"
          />
          <Field
            label="Material"
            name="material"
            value={form.material}
            onChange={handleChange}
            placeholder="Ex: Aluminium / Plastic"
          />
          <Field
            label="Pack"
            name="pack"
            value={form.pack}
            onChange={handleChange}
            placeholder="Ex: Pack of 2"
          />
        </div>

        <div style={styles.field}>
          <label>Key Features</label>
          <textarea
            name="keyFeatures"
            value={form.keyFeatures}
            onChange={handleChange}
            placeholder="Ex: Energy Saving, Modern Design, Ceiling Mount"
            style={styles.textarea}
          />
        </div>

        <button
          type="submit"
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "⚙️ Generating..." : "🚀 Generate Daraz Titles"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {titles.length > 0 && (
        <div style={styles.resultBox}>
          <h3 style={{ marginBottom: "10px" }}>✨ Generated Titles</h3>
          {titles.map((t, i) => (
            <div key={i} style={styles.titleCard}>
              <p style={{ margin: 0, lineHeight: "1.5" }}>{t}</p>
              <div style={styles.titleFooter}>
                <span style={{ color: charColor(t.length), fontSize: "13px" }}>
                  {t.length}/120
                </span>
                <button
                  style={styles.copyBtn}
                  onClick={() => handleCopy(t)}
                  title="Copy Title"
                >
                  📋 Copy
                </button>
              </div>
            </div>
          ))}
          <button onClick={handleGenerate} style={styles.regenBtn}>
            🔁 Regenerate Titles
          </button>
        </div>
      )}
    </div>
  );
}

const Field = ({ label, name, value, onChange, placeholder, required }) => (
  <div style={styles.field}>
    <label>
      {label} {required && <span style={{ color: "#ff5b5b" }}>*</span>}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      style={styles.input}
    />
  </div>
);

const styles = {
  container: {
    maxWidth: "850px",
    margin: "40px auto",
    padding: "30px",
    borderRadius: "16px",
    background: "rgba(30, 30, 30, 0.9)",
    color: "#fff",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
    fontFamily: "Poppins, sans-serif",
  },
  heading: { textAlign: "center", color: "#00d47e", fontSize: "26px" },
  subtext: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: "25px",
    fontSize: "14px",
  },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
  },
  field: { display: "flex", flexDirection: "column" },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#2c2c2c",
    color: "#fff",
  },
  textarea: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#2c2c2c",
    color: "#fff",
    minHeight: "80px",
  },
  button: {
    background: "#00d47e",
    border: "none",
    padding: "14px",
    color: "#000",
    fontWeight: "bold",
    borderRadius: "10px",
    marginTop: "10px",
    fontSize: "16px",
    transition: "0.3s",
  },
  resultBox: {
    marginTop: "25px",
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "10px",
  },
  titleCard: {
    borderBottom: "1px solid #333",
    padding: "10px 0",
  },
  titleFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "6px",
  },
  copyBtn: {
    background: "#00d47e",
    border: "none",
    padding: "6px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#000",
    fontWeight: "bold",
    fontSize: "13px",
  },
  regenBtn: {
    marginTop: "20px",
    background: "#444",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "500",
    width: "100%",
  },
  error: { color: "#ff5b5b", marginTop: "10px", textAlign: "center" },
};
