
import React, { useState } from "react";  
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  onAddSuccess?: () => void;  // optional callback on success
};

export const AddInsight = (props: AddInsightProps) => {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
  const serverport = import.meta.env.VITE_SERVER_PORT;
  const [selectedBrand, setSelectedBrand] = useState(BRANDS[0]?.id || "");
  const [insightText, setInsightText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!selectedBrand) {
      setError("Please select a brand.");
      setLoading(false);
      return;
    }

    if (!insightText.trim()) {
      setError("Insight text cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      const createdAt = new Date().toISOString(); // valid ISO timestamp

      const response = await fetch(`${baseUrl}:${serverport}/insights/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: Number(selectedBrand),
          createdAt: createdAt,
          text: insightText,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add insight");
      }

      // Reset form on success
      setInsightText("");
      setSelectedBrand(BRANDS[0]?.id || "");

      // Optional callbacks
      if (props.onAddSuccess) props.onAddSuccess();
      if (props.onClose) props.onClose();

    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form} onSubmit={addInsight}>
        <label className={styles.field}>
          Brand (ID: {selectedBrand})
          <select
            className={styles["field-input"]}
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            disabled={loading}
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
            value={insightText}
            onChange={(e) => setInsightText(e.target.value)}
            disabled={loading}
          />
        </label>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button
          className={styles.submit}
          type="submit"
          label={loading ? "Adding..." : "Add insight"}
          disabled={loading}
        />
      </form>
    </Modal>
  );
};
