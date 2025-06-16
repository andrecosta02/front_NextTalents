import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./TelaInicio.css";

export default function TelaInicio() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <header className="header">
        <img src="/logo-nextTalents.png" alt="Nex.Talents Logo" className="logo" />
        <h2>
          Você cria. A gente conecta.
        </h2>
      </header>

      <main className="main">
        <div className="description">
          <i className="welcome">Seja bem-vindo(a)</i> à <strong>Next Talents</strong> uma plataforma onde jovens inscrevem seus projetos e mostram ao mundo quem são. Aqui, talento, criatividade e propósito se encontram em um só lugar. 
          <br />
          <br />
          Conectamos jovens a instituições de ensino e empresas que reconhecem o valor de ideias autênticas e impulsionam novas oportunidades de futuro.
        </div>

        <div className="cards">
          {/* <div className="card" onClick={() => navigate("/aluno/login")} style={{ cursor: "pointer" }}>
            <img src="/aluno.png" alt="Aluno" className="card-image" />
            <span className="card-title">Jovem</span>
          </div>
           */}
          <div className="card" onClick={() => navigate("/ie/login")} style={{ cursor: "pointer" }}>
            <img src="/instituicao.png" alt="Instituição de Ensino" className="card-image" />
            <span className="card-title">Instituição de Ensino</span>
          </div>

          <div className="card" onClick={() => navigate("/empresa/login")} style={{ cursor: "pointer" }}>
            <img src="/empresa.png" alt="Empresa Parceira" className="card-image" />
            <span className="card-title">Empresa Parceira</span>
          </div>
        </div>
      </main>


      <section className="how-it-works">
          <h3>Como funciona a plataforma?</h3>
          <div className="workflow">
            <div className="workflow-step">
              <strong>🏫 A instituição de ensino:</strong>
              <ul>
                <li>Procura por jovens talentos</li>
                <li>Fornece ao Jovem bolsas de estudos</li>
                <li>Orienta e Cadastra os alunos na plataforma</li>
              </ul>
            </div>
            <div className="workflow-step">
              <strong>💼 As Empresas:</strong>
              <ul>
                <li>Recebem os jovens talentos das Instituições</li>
                <li>Contrata alunos para estágios ou demandas</li>
                <li>Contribuem para o crescimento do aluno</li>
              </ul>
            </div>
          </div>
          <br />
          {/* <iframe src="https://www.youtube.com/watch?v=HezKd8CNbVs" height="300px" width="100%" name="iframe_a" title="Iframe Example"></iframe> */}
          {/* <p><a href="https://www.youtube.com/watch?v=HezKd8CNbVs" target="iframe_a">ProjetoNexTalents</a></p> */}
          <iframe width="560" height="315" src="https://www.youtube.com/embed/HezKd8CNbVs?si=nIOYT-vBWx7hYEse" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

        </section>
    </div>
  );
}
