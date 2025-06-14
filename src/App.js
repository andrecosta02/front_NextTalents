import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TelaInicio from './pages/telaInicio/TelaInicio';
import PrivateRoute from './routes/PrivateRoute';
import Desenvolvimento from './pages/gerenic/PaginaEmDesenvolvimento';

// Imports do Aluno
import AlunoRegister from './pages/aluno/telaCadastro/Register';
import AlunoConfirmaEmail from './pages/aluno/confirmaEmail/confirmaEmail';
import AlunoTelaLogin from './pages/aluno/telaLogin/LoginPage';
import AlunoNovaSenhaPage from './pages/aluno/novaSenha/novaSenhaPage';
import AlunoDashboard from './pages/aluno/dashboard/dashboard';

// Imports da Instituição de Ensino
import IeRegister from './pages/ie/telaCadastro/Register';
import IeConfirmaEmail from './pages/ie/confirmaEmail/confirmaEmail';
import IeTelaLogin from './pages/ie/telaLogin/LoginPage';
import IeNovaSenhaPage from './pages/ie/novaSenha/novaSenhaPage';
import IeDashboard from './pages/ie/dashboard/dashboard';

// Imports da empresa
import empresaRegister from './pages/empresa/telaCadastro/Register';
import empresaConfirmaEmail from './pages/empresa/confirmaEmail/confirmaEmail';
import empresaTelaLogin from './pages/empresa/telaLogin/LoginPage';
import empresaNovaSenhaPage from './pages/empresa/novaSenha/novaSenhaPage';
import empresaDashboard from './pages/empresa/dashboard/dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaInicio />} />
        <Route path="/desenvolvimento" element={<Desenvolvimento />} />

        {/* Rotas do Aluno */}
        <Route path="/aluno/register" element={< AlunoRegister />} />
        <Route path="/aluno/confirma-email" element={< AlunoConfirmaEmail />} />
        <Route path="/aluno/login" element={< AlunoTelaLogin />} />
        <Route path="/aluno/reset-senha" element={< AlunoNovaSenhaPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/aluno/dashboard"
          element={
            <PrivateRoute>
              <AlunoDashboard />
            </PrivateRoute>
          }
        />

        {/* Rotas da Instituição de Ensino */}
        <Route path="/ie/register" element={< IeRegister />} />
        <Route path="/ie/confirma-email" element={< IeConfirmaEmail />} />
        <Route path="/ie/login" element={< IeTelaLogin />} />
        <Route path="/ie/reset-senha" element={< IeNovaSenhaPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route
          path="/ie/dashboard"
          element={
            <PrivateRoute>
              <IeDashboard />
            </PrivateRoute>
          }
        />
        {/* Rotas da empresa */}
        <Route path="/empresa/register" element={< empresaRegister />} />
        <Route path="/empresa/confirma-email" element={< empresaConfirmaEmail />} />
        <Route path="/empresa/login" element={< empresaTelaLogin />} />
        <Route path="/empresa/reset-senha" element={< empresaNovaSenhaPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/empresa/dashboard" element={
          <PrivateRoute>
             <empresaDashboard />
          </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

