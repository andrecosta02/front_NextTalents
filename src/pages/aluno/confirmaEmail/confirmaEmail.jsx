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

    console.log("Token recebido:", token);

    if (!token) {
      setStatus("error");
      setMessage("Token inválido ou ausente.");
      return;
    }

    const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nexttalents/student/confirm-email`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("E-mail confirmado com sucesso!");
          setTimeout(() => navigate("/login"), 3000);
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