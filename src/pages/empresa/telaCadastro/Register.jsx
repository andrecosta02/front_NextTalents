
import React, { useState, useEffect, useRef } from "react";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import PopupMessage from "../../../components/PopupMessage";
import "./Register.css";

const Register = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    email: "",
    pass: "",
    confirmPass: "",
    cnpj: ""
  });

  const [showPopup, setShowPopup] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submitBtnRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      pass: "",
      confirmPass: "",
      cnpj: ""
    });
    setMessage("");
    setError("");
  };

  const formatCNPJ = (cnpj) => cnpj.replace(/\D/g, "");
  const formatCEP = (cep) => cep.replace(/\D/g, "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showPopup) return;

    setMessage("");
    setError("");

    console.log("Captcha:", captchaVerified);
    if (!captchaVerified) {
      setPopupType("error");
      setMessage("Por favor, verifique o reCAPTCHA.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setMessage("");
      }, 6000);
      return;
    }

    if (formData.pass !== formData.confirmPass) {
      setPopupType("error");
      setMessage("As senhas não coincidem.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setMessage("");
      }, 10000);
      return;
    }

    const payload = {
      nome: formData.name,
      unit: formData.unit,
      email: formData.email,
      pass: formData.pass,
      cnpj: formatCNPJ(formData.cnpj)
    };

    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nexttalents/enterprise/register`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log(data);

      if (res.status === 201) {
        setPopupType("success");
        setMessage("Cadastro realizado, confirme o acesso no seu email!");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
          navigate("/enterprise/login");
        }, 8000);
      } else if (res.status === 422 && data.errors) {
        setPopupType("error");
        setMessage(data.errors[0].msg);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
        }, 10000);
      } else {
        setPopupType("error");
        setMessage("Erro ao cadastrar. Verifique os dados e tente novamente.");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
        }, 10000);
      }
    } catch (err) {
      setPopupType("error");
      setMessage("Erro de conexão com o servidor.");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setMessage("");
      }, 10000);
    }
  };

  // reCAPTCHA callbacks
  window.handleCaptchaVerify = function(token) {
    if (token) setCaptchaVerified(true);
  };

  window.handleCaptchaExpired = function() {
    setCaptchaVerified(false);
  };

  return (
    <div className="register-container">
      <a href="/">
        <img src="/logo-nextTalents.png" alt="Nex.Talents" className="logo" />
      </a>
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Criar Conta</h2>
        {/* <div className="input-row"> */}
        <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} required />
        <input type="text" name="unit" placeholder="Unidade" value={formData.unit} onChange={handleChange} required />
          {/* <input type="text" name="last_name" placeholder="Sobrenome" value={formData.last_name} onChange={handleChange} required /> */}
        {/* </div> */}
        <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
        {/* <input type="date" name="birth" placeholder="Data de Nascimento" value={formData.birth} onChange={handleChange} required /> */}
        <div className="input-row">
          <input type="password" name="pass" placeholder="Senha" value={formData.pass} onChange={handleChange} required />
          <input type="password" name="confirmPass" placeholder="Confirmar Senha" value={formData.confirmPass} onChange={handleChange} required />
        </div>
        <InputMask mask="99.999.999/9999-99" name="cnpj" placeholder="CNPJ" value={formData.cnpj} onChange={handleChange} required />
        {/* <InputMask mask="99999-999" name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange} required /> */}
        {/* <input type="text" name="city" placeholder="Cidade" value={formData.city} onChange={handleChange} required /> */}

        <div className="g-recaptcha" data-sitekey="6Ld2DC0rAAAAACZIrYP3fBSXGzNQ9_i5K1aSxtFr" data-callback="handleCaptchaVerify" data-expired-callback="handleCaptchaExpired" style={{ marginBottom: "15px" }}></div>

        <div className="button-row">
          <button type="button" onClick={clearForm}>Limpar</button>
          <button type="submit" ref={submitBtnRef}>Cadastrar</button>
        </div>
      </form>

      <PopupMessage type={popupType} message={message} onClose={() => {
        setShowPopup(false);
        setMessage("");
      }} />
    </div>
  );
};

export default Register;
