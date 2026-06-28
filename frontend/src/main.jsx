import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvajder } from "./kontekst/AuthKontekst";
import "./stilovi/style.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvajder>
        <App />
      </AuthProvajder>
    </BrowserRouter>
  </React.StrictMode>
);
