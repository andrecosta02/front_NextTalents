import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PopupMessage from "../../../components/popupMessage/PopupMessage";
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success"); // ou "error"
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      let pass = senha
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nexttalents/enterprise/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pass }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('nome', data.nome);
        console.log(data.nome)
        setPopupType("success");
        setMessage("Login realizado com sucesso!");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate("/empresa/dashboard");
        }, 1000);

      } else {
        setPopupType("error");
        setMessage(data.message);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 10000);
      }
    } catch (err) {
      setPopupType("error");
      setMessage("Erro de conexão com o servidor.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 10000);
    }
  };

  const handleForgtPass = async () => {
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nexttalents/enterprise/forgot-pass`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        // setMensagem('se existir cadastro um email sera enviado');

        setPopupType("success");
        setMessage("Se existir cadastro um e-mail será enviado!");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          // navigate("/empresa/login");
        }, 5000);

      } else {
        setMensagem('Erro no envio do email.');
      }
    } catch (err) {
      // setMensagem('Erro de conexão com o servidor.');

      setPopupType("error");
      setMessage("Erro de conexão com o servidor.");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 10000);
    }
  };

  return (
    <div className="login-container">
      <a href="/">
        <img src="/logo-nextTalents.png" alt="Nex.Talents" className="logo" />
      </a>

      <div className="login-box">
        <h2>Login</h2>
        <label>Email:</label>
        <input
          type="email"
          placeholder="seunome@email.com"
          // value={formData.email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Senha:</label>
        <input
          type="password"
          placeholder="********"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button onClick={handleLogin}>Acessar</button>
        <div className="cadastro" onClick={() => navigate("/empresa/register")} style={{ cursor: "pointer" }}>
          <p className="cadastro">Não possui login?</p>
        </div>
        <p className="esqueciSenha" onClick={handleForgtPass}>Esqueceu a senha?</p>
        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>

      <PopupMessage
        type={popupType}
        message={message}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default LoginPage;