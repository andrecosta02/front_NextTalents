
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../../utils/auth";
import PopupMessage from "../../../components/popupMessage/PopupMessage";
// import "./dashboard.css";
import "./dashboard.css";
import AlunoCrud from "./aluno/aluno";
import Empresas from "./empresas/empresas";
import Perfil from "./perfil/perfil";

const Dashboard = () => {
  const user = getLoggedUser();
  const navigate = useNavigate();
  // const [selectedMenu, setSelectedMenu] = useState("sobre");
  const [selectedMenu, setSelectedMenu] = useState("alunos");
  const [menuOpen, setMenuOpen] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success"); // ou "error"
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPerfilModal, setShowPerfilModal] = useState(false);


  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {

    setPopupType("success");
    setMessage("Logout realizado com sucesso!");
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      localStorage.removeItem("token");
      navigate("/");
    }, 1000);

  };


  const renderContent = () => {
    switch (selectedMenu) {
      case "alunos":
        return <AlunoCrud />;
      case "empresas":
        return < Empresas />;
      case "perfil":
        return <Perfil />
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img
          src="/logo-nextTalents.png"
          alt="Logo"
          className="dashboard-logo"
        />
      </header>

      <div className={`dashboard-menu ${menuOpen ? "open" : ""}`}>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="icon">☰</span>
          <span className="text">Fechar</span>
        </button>

        <div className="menu-section">
          <button className="menu-item" onClick={() => setSelectedMenu("alunos")}>

            <span className="icon">📄</span>
            <span className="text">Alunos</span>
          </button>
        </div>

        <div className="menu-section">
          <button className="menu-item" onClick={() => setSelectedMenu("empresas")}>

            <span className="icon">📄</span>
            <span className="text">Empresas</span>
          </button>
        </div>

        <div className="menu-bottom">
          {/* <button className="menu-item" onClick={() => setSelectedMenu("perfil")}> */}
          <button className="menu-item" onClick={() => setShowPerfilModal(true)}>
            <span className="icon">👤</span>
            <span className="text">Meu Perfil</span>
          </button>
          <button className="menu-item" onClick={handleLogout}>
            <span className="icon">🚪</span>
            <span className="text">Sair</span>
          </button>
        </div>
      </div>

      <main className="dashboard-content">
        {renderContent()}
      </main>


      <PopupMessage
        type={popupType}
        message={message}
        onClose={() => setShowPopup(false)}
      />

      {showPerfilModal && (
        <div className="modal-overlay" onClick={() => setShowPerfilModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Perfil closeModal={() => setShowPerfilModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
