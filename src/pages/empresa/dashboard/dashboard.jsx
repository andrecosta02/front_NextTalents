
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../../utils/auth";
import "./dashboard.css";
import AlunoCrud from "./alunos/alunos";


const Dashboard = () => {
  const user = getLoggedUser();
  const navigate = useNavigate();
  // const [selectedMenu, setSelectedMenu] = useState("sobre");
  const [selectedMenu, setSelectedMenu] = useState("alunos");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const renderContent = () => {
    switch (selectedMenu) {
      // case "sobre":
      //   return <div><h2>Sobre Mim</h2><p>Informações do aluno para empresas (bio, experiências, etc.).</p></div>;
      case "alunos":
        return <AlunoCrud />;
      case "perfil":
        return <div><h2>Meu Perfil</h2><p>Editar informações de cadastro do usuário (email, senha, notificações).</p></div>;
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
          {/* <button className="menu-item" onClick={() => setSelectedMenu("sobre")}> */}
          <button className="menu-item" onClick={() => setSelectedMenu("alunos")}>
            
            <span className="icon">📄</span>
            <span className="text">Alunos</span>
          </button>
          {/* <button className="menu-item" onClick={() => setSelectedMenu("meus")}>
            <span className="icon">📁</span>
            <span className="text">Meus Projetos</span>
          </button>
          <button className="menu-item" onClick={() => setSelectedMenu("geral")}>
            <span className="icon">🌐</span>
            <span className="text">Projetos Geral</span>
          </button>
          <button className="menu-item" onClick={() => setSelectedMenu("instituicoes")}>
            <span className="icon">🏛️</span>
            <span className="text">Instituições</span>
          </button>
          <button className="menu-item" onClick={() => setSelectedMenu("empresas")}>
            <span className="icon">🏢</span>
            <span className="text">Empresas</span>
          </button> */}
        </div>

        <div className="menu-bottom">
          <button className="menu-item" onClick={() => setSelectedMenu("perfil")}>
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
    </div>
  );
};

export default Dashboard;
