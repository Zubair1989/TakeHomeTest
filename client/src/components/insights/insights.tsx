/*import React, { useEffect, useState } from "react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { DeleteInsightButton } from "../../components/delete-insight/delete-insight.tsx";
import { UpdateInsight } from "../../components/update-insight/update-insight.tsx";
import { UpdateModal } from "../modal/update-modal.tsx";

type InsightsProps = {
  className?: string;
};

export const Insights = ({ className }: InsightsProps) => {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
  const serverport = import.meta.env.VITE_SERVER_PORT;
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);

  const fetchInsights = async () => {
    try {
      const response = await fetch(`${baseUrl}:${serverport}/insights`);
      if (!response.ok) throw new Error(`Failed: ${response.status}`);
      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleDeleted = (id: string) => {
    setInsights((prev) => prev.filter((insight) => insight.id !== id));
  };

  const handleUpdated = (updatedInsight: Insight) => {
    setInsights((prev) =>
      prev.map((insight) =>
        insight.id === updatedInsight.id ? updatedInsight : insight
      )
    );
    setEditingInsight(null);
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>

      {loading && <p>Loading insights...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className={styles.list}>
        {insights.length ? (
          insights.map(({ id, text, createdAt, brand }) => (
            <div className={styles.insight} key={id}>
              <div className={styles["insight-meta"]}>
                <span>
                  <strong>Brand ID:</strong> {brand}
                </span>
                <span style={{ marginLeft: 10 }}>
                  <strong>Description:</strong> {text || "N/A"}
                </span>
                <div className={styles["insight-meta-details"]}>
                  <span>{new Date(createdAt).toLocaleDateString()}</span>
                  <DeleteInsightButton id={id} onDeleted={handleDeleted} />
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => {
                      console.log("Editing insight:", id);
                      setEditingInsight({ id, text, createdAt, brand });
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <p className={styles["insight-content"]}>{text}</p>
            </div>
          ))
        ) : (
          !loading && <p>We have no insight!</p>
        )}
      </div>

      {editingInsight && (
        <UpdateModal onClose={() => setEditingInsight(null)}>
          <UpdateInsight
            insight={editingInsight}
            onUpdated={handleUpdated}
            onCancel={() => setEditingInsight(null)}
          />
        </UpdateModal>
      )}
    </div>
  );
};
*/



import React, { useEffect, useState } from "react";
import { cx } from "../../lib/cx.ts";
import styles from "./insights.module.css";
import type { Insight } from "../../schemas/insight.ts";
import { DeleteInsightButton } from "../../components/delete-insight/delete-insight.tsx";
import { UpdateInsight } from "../../components/update-insight/update-insight.tsx";
import { UpdateModal } from "../modal/update-modal.tsx";
import { AddInsight } from "../../components/add-insight/add-insight.tsx"; // import AddInsight

type InsightsProps = {
  className?: string;
};

export const Insights = ({ className }: InsightsProps) => {
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
  const serverport = import.meta.env.VITE_SERVER_PORT;
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [showAddModal, setShowAddModal] = useState(false); // state for AddInsight modal

  const fetchInsights = async () => {
    try {
      const response = await fetch(`${baseUrl}:${serverport}/insights`);
      if (!response.ok) throw new Error(`Failed: ${response.status}`);
      const data = await response.json();
      setInsights(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleDeleted = (id: string) => {
    setInsights((prev) => prev.filter((insight) => insight.id !== id));
  };

  const handleUpdated = (updatedInsight: Insight) => {
    setInsights((prev) =>
      prev.map((insight) =>
        insight.id === updatedInsight.id ? updatedInsight : insight
      )
    );
    setEditingInsight(null);
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>

      <button onClick={() => setShowAddModal(true)}>Add New Insight</button>

      {loading && <p>Loading insights...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className={styles.list}>
        {insights.length ? (
          insights.map(({ id, text, createdAt, brand }) => (
            <div className={styles.insight} key={id}>
              <div className={styles["insight-meta"]}>
                <span>
                  <strong>Brand ID:</strong> {brand}
                </span>
                <span style={{ marginLeft: 10 }}>
                  <strong>Description:</strong> {text || "N/A"}
                </span>
                <div className={styles["insight-meta-details"]}>
                  <span>{new Date(createdAt).toLocaleDateString()}</span>
                  <DeleteInsightButton id={id} onDeleted={handleDeleted} />
                  <button
                    style={{ marginLeft: 10 }}
                    onClick={() => setEditingInsight({ id, text, createdAt, brand })}
                  >
                    Edit
                  </button>
                </div>
              </div>
              <p className={styles["insight-content"]}>{text}</p>
            </div>
          ))
        ) : (
          !loading && <p>We have no insight!</p>
        )}
      </div>

      {editingInsight && (
        <UpdateModal onClose={() => setEditingInsight(null)}>
          <UpdateInsight
            insight={editingInsight}
            onUpdated={handleUpdated}
            onCancel={() => setEditingInsight(null)}
          />
        </UpdateModal>
      )}

      {showAddModal && (
        <AddInsight
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddSuccess={() => {
            fetchInsights();   // Refresh list after add
            setShowAddModal(false);  // Close the add modal
          }}
        />
      )}
    </div>
  );
};
