import React, { useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import styles from "../update-insight/update-insight.module.css";



type Insight = {
  id: string;
  text: string;
  brand: number;
  createdAt: string;
};

type UpdateInsightProps = {
  insight: Insight;
  onUpdated: (updatedInsight: Insight) => void;
  onCancel: () => void;
};

export const UpdateInsight = ({ insight, onUpdated, onCancel }: UpdateInsightProps) => {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
  const serverport = import.meta.env.VITE_SERVER_PORT;
  const [text, setText] = useState(insight.text);
  const [brand, setBrand] = useState(insight.brand.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!brand) {
      setError("Please select a brand.");
      setLoading(false);
      return;
    }
    if (!text.trim()) {
      setError("Insight text cannot be empty.");
      setLoading(false);
      return;
    }

    try {  

      const response = await fetch(`${baseUrl}:${serverport}/insights/${insight.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: Number(brand), text }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Update failed: ${response.status}`);
      }

      const updated = await response.json();
      onUpdated(updated);
    } catch (err: any) {
      setError(err.message || "Update error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className={styles.heading}>Update Insight</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          Brand (ID: {brand})
          <select
            className={styles["field-input"]}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            disabled={loading}
            required
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          Insight
          <textarea
            className={styles["field-input"]}
            rows={5}
            placeholder="Something insightful..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            className={styles.cancelbtn}
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className={styles.updatebtn} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};