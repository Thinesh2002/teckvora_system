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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePrompt = () => {
    return `
Product Name: ${form.productName}
Colour: ${form.colour}
Size: ${form.size}
Material: ${form.material}
Pack: ${form.pack}
Key Features: ${form.keyFeatures}
`.trim();
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setTitles([]);
    setLoading(true);

    try {
      const res = await API.post("/ai/generate-title", {
        name: generatePrompt(),
        market: "lk", // fixed for Daraz Sri Lanka
      });
      if (res.data.titles) setTitles(res.data.titles);
      else setError("No titles generated");
    } catch (err) {
      console.error(err);
      setError("Failed to generate Daraz titles");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("✅ Title copied to clipboard!");
  };

  // ✅ Adjusted for 90–120 char Daraz range
  const charColor = (len) => {
    if (len < 90) return "#ff5b5b"; // too short
    if (len > 120) return "#ffaa00"; // too long
    return "#00d47e"; // perfect
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🛍️ Daraz LK Title Generator (SEO Optimized)</h2>

      <form onSubmit={handleGenerate} style={styles.form}>
        <div style={styles.grid}>
          <Field
            label="Product Name"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="Ex: LED Ceiling Light"
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
            placeholder="Ex: Energy Saving, Modern Design, Indoor Lighting, Ceiling Mount"
            style={styles.textarea}
          />
        </div>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Generating..." : "Generate Daraz Titles"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {titles.length > 0 && (
        <div style={styles.resultBox}>
          <h3>Generated Titles</h3>
          {titles.map((t, i) => (
            <div key={i} style={styles.titleCard}>
              <p style={{ margin: 0 }}>{t}</p>
              <div style={styles.titleFooter}>
                <span style={{ color: charColor(t.length), fontSize: "13px" }}>
                  {t.length}/120
                </span>
                <button style={styles.copyBtn} onClick={() => handleCopy(t)}>
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

// ---------- Reusable Input Component ----------
const Field = ({ label, name, value, onChange, placeholder }) => (
  <div style={styles.field}>
    <label>{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={styles.input}
    />
  </div>
);

// ---------- Styles ----------
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "25px",
    borderRadius: "12px",
    background: "#1e1e1e",
    color: "#fff",
    boxShadow: "0 0 15px rgba(0,0,0,0.5)",
    fontFamily: "Poppins, sans-serif",
  },
  heading: { textAlign: "center", marginBottom: "25px", color: "#00d47e" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  field: { display: "flex", flexDirection: "column" },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#2c2c2c",
    color: "#fff",
  },
  textarea: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #444",
    background: "#2c2c2c",
    color: "#fff",
    minHeight: "70px",
  },
  button: {
    background: "#00d47e",
    border: "none",
    padding: "12px",
    color: "#000",
    fontWeight: "bold",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },
  resultBox: {
    marginTop: "25px",
    background: "#2c2c2c",
    padding: "18px",
    borderRadius: "10px",
  },
  titleCard: {
    borderBottom: "1px solid #444",
    padding: "10px 0",
  },
  titleFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  copyBtn: {
    background: "#00d47e",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#000",
    fontWeight: "bold",
  },
  regenBtn: {
    marginTop: "15px",
    background: "#444",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "500",
  },
  error: { color: "#ff5b5b", marginTop: "10px" },
};
