import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../../../utils/auth";
import './Aluno.css';

const Aluno = () => {
  const user = getLoggedUser();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("sobre");
  const [menuOpen, setMenuOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [alunos, setAlunos] = useState([]);
  const [formData, setFormData] = useState({ 
    nome: '',
    unit: '',
    email: '',
    birth: '',
    cpf: '',
    cep: '',
    city:'',
    description: '' });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAluno = () => {
    if (!formData.nome || !formData.cpf || !formData.descricao) return;
    setAlunos([...alunos, formData]);
    setFormData({ nome: '', cpf: '', descricao: '' });
    setShowModal(false);
  };

    const payload = {
      nome: formData.name,
      unit: formData.unit,
      email: formData.email,
      birth: formData.birth,
      cpf: formData.cpf,
      cep: formData.cep,
      city: formData.city,
      description: formData.description
    };

    

  const renderContent = () => {
    switch (selectedMenu) {
      case "sobre":
        return <div><h2>Sobre Mim</h2><p>Informações do aluno para empresas (bio, experiências, etc.).</p></div>;
      case "aluno":
        return (
          <div className="aluno-container">
            <div className="aluno-header">
              <h2>Estudantes da Universidade                 </h2>
              <button className="btn-add" onClick={() => setShowModal(true)}>＋</button>
              <input
                  type="text"
                  placeholder="Pesquisar aluno..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="cards">
              {alunos
                  .filter((aluno) =>
                    aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((aluno, index) => (
                    <div className="card" key={index}>
                      <h3>{aluno.nome}</h3>
                      <p><strong>Descrição: </strong>{aluno.descricao}</p>
                      <div className="card-actions">
                      <button className="btn-edit">✏️</button>
                      <button className="btn-delete">🗑️</button>
                    </div>
                    </div>
                ))}
            </div>

            {showModal && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <h2>Adicionar Aluno</h2>
                    <button onClick={() => setShowModal(false)} className="close-btn">✕</button>
                  </div>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Nome do aluno"
                    value={formData.nome}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="cpf"
                    placeholder="CPF"
                    value={formData.cpf}
                    onChange={handleChange}
                  />
                  <textarea
                    name="descricao"
                    placeholder="Descrição"
                    value={formData.descricao}
                    onChange={handleChange}
                  ></textarea>
                  <button className="btn-confirm" onClick={handleAddAluno}>Adicionar</button>
                </div>
              </div>
            )}
          </div>
        );
      case "perfil":
        return <div><h2>Meu Perfil</h2><p>Editar informações de cadastro do usuário (email, senha, notificações).</p></div>;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src="/logo-nextTalents.png" alt="Logo" className="dashboard-logo" />
      </header>

      <div className={`dashboard-menu ${menuOpen ? "open" : ""}`}>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="icon">☰</span>
          <span className="text">Fechar</span>
        </button>

        <div className="menu-section">
          <button className="menu-item" onClick={() => setSelectedMenu("aluno")}>
            <span className="icon">📄</span>
            <span className="text">Alunos</span>
          </button>
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
export default Aluno;
