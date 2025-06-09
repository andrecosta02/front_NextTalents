import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './novaSenhaPage.css';

const NovaSenhaPage = () => {
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleSenha = async () => {
    if (!token) {

      setMensagem("Token inválido ou ausente.");
      return;
    }

    if (senha !== confirmSenha) {
      setMensagem("As senhas não coincidem.");
      return;
    }

    try {
      let newPassword = senha

      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nexttalents/student/reset-pass`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMensagem('Senha alterada com sucesso!');
        navigate("/login");
      } else {
        setMensagem(data.mensagem || 'Erro ao alterar a senha.');
      }
    } catch (err) {
      setMensagem('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Alteração de Senha</h2>

        <label>Nova Senha:</label>
        <input
          type="password"
          placeholder="********"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <label>Confirmar Senha:</label>
        <input
          type="password"
          placeholder="********"
          value={confirmSenha}
          onChange={(e) => setConfirmSenha(e.target.value)}
          required
        />

        <button onClick={handleSenha}>Concluir</button>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
};

export default NovaSenhaPage;
