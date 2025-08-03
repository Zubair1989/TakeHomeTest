import React from "react"; 
import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight>([]);
  const baseUrl = import.meta.env.VITE_SERVER_BASE_URL;
  const serverport = import.meta.env.VITE_SERVER_PORT;

  useEffect(() => {
    fetch(`${baseUrl}:${serverport}/insights`).then((res) => setInsights(res.json()));
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <Insights className={styles.insights} insights={insights} />
    </main>
  );
};

