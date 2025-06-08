import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./confirmaEmail.css";

export default function ConfirmEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Token inválido ou ausente.");
      return;
    }

    console.log(JSON.stringify({ token }))

    fetch("http://localhost:8080/nexttalents/ie/confirm-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("E-mail confirmado com sucesso!");
          setTimeout(() => navigate("/ie/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Erro ao confirmar e-mail.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Erro de conexão com o servidor.");
      });
  }, [location.search, navigate]);

  return (
    <div className="confirm-email-container">
      <div className={`confirm-box ${status}`}>
        {status === "loading" && <p>Confirmando seu e-mail...</p>}
        {status !== "loading" && <p>{message}</p>}
      </div>
    </div>
  );
}