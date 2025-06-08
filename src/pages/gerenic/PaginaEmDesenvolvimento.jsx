
import React from 'react';
import './PaginaEmDesenvolvimento.css';

export default function PaginaEmDesenvolvimento() {
  return (
    <div className="dev-container">
      <header className="dev-header">
        <a href="/">
          <img src="/logo-nextTalents.png" alt="Next Talents Logo" className="logo" />
        </a>
      </header>
      <main className="dev-main">
        <img src="/robot-dev.png" alt="Robô em desenvolvimento" className="dev-robot" />
        <p className="dev-text">Página em desenvolvimento</p>
      </main>
    </div>
  );
}
