// src/context/MaintenanceContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const MaintenanceContext = createContext();

export function MaintenanceProvider({ children }) {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        // Use fetch with full URL to avoid baseURL issues
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
        const res = await fetch(`${baseURL.replace('/api/v1', '')}/api/v1/maintenance/status`);
        const data = await res.json();
        console.log("Maintenance status:", data); // Debug log
        setMaintenanceMode(data.enabled);
        setMaintenanceMessage(data.message || "We are currently performing scheduled maintenance. We'll be back soon!");
      } catch (err) {
        console.error("Failed to check maintenance status:", err);
        // If API fails, assume not in maintenance mode
        setMaintenanceMode(false);
      } finally {
        setLoading(false);
      }
    };

    checkMaintenanceStatus();

    // Check every 30 seconds
    const interval = setInterval(checkMaintenanceStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <MaintenanceContext.Provider
      value={{ maintenanceMode, maintenanceMessage, loading }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
}

export const useMaintenance = () => useContext(MaintenanceContext);
