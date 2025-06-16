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
                <li>Valida o que o jovem criou</li>
                <li>Fornece um selo ou certificado de qualidade</li>
                <li>Orienta e Cadastra os alunos a evoluírem</li>
              </ul>
            </div>
            <div className="workflow-step">
              <strong>💼 Os chefes:</strong>
              <ul>
                <li>Recebem talentos já testados e certificados</li>
                <li>Contrata alunos para estágios ou demandas</li>
                <li>Mentoram alunos ou lançam demandas reais</li>
              </ul>
            </div>
          </div>
          <iframe src="demo_iframe.htm" height="300px" width="100%" name="iframe_a" title="Iframe Example"></iframe>
          <p><a href="https://www.youtube.com/watch?v=HezKd8CNbVs" target="iframe_a">ProjetoNexTalents</a></p>

        </section>
    </div>
  );
}
