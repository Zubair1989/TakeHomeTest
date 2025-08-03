import React, { useState } from "react";
import { Trash2Icon } from "lucide-react";
import styles from "./delete-insight.module.css";

type DeleteInsightButtonProps = {
  id: string;
  onDeleted: (id: string) => void;
};

export const DeleteInsightButton = ({ id, onDeleted }: DeleteInsightButtonProps) => {
  const [loading, setLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
  const serverport = import.meta.env.VITE_SERVER_PORT;


  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this insight?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}:${serverport}/insights/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Delete failed with status ${response.status}`);
      }

      onDeleted(id); // Notify parent to update state
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={styles["insight-delete"]}
      onClick={handleDelete}
      disabled={loading}
      aria-label="Delete Insight"
      title="Delete Insight"
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
    >
      <Trash2Icon color={loading ? "gray" : "red"} />
    </button>
  );
};
