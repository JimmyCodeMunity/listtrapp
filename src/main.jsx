import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { MaintenanceProvider } from "./context/MaintenanceContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MaintenanceProvider>
        <AuthProvider>
          <WishlistProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </WishlistProvider>
        </AuthProvider>
      </MaintenanceProvider>
    </BrowserRouter>
  </StrictMode>
);
