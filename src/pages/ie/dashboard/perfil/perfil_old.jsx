import React, { useState, useEffect, useRef } from "react";
import PopupMessage from "../../../../components/popupMessage/PopupMessage";
import { useNavigate } from "react-router-dom";
import "./perfil.css";

// const Perfil = () => {
const Perfil = ({ closeModal }) => {
  const overlayRef = useRef(null);
  // const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    email: "",
    notification_email: false,
    darkmode: false,
    notify_new_student: false,
    notify_new_company: false
  });

  const token = localStorage.getItem("token")

  const fetchIe = async () => {
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/ie/listOne`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const ie = data[0];
        setFormData((prev) => ({
          ...prev,
          name: ie.nome || "",
          unit: ie.unit || "",
          email: ie.email || "",
          cnpj: formatCNPJ(ie.cnpj || ""),
          notification_email: !!ie.notification_email,
          darkmode: !!ie.darkmode,
        }));
      }

    } catch (err) {
      console.error("Erro ao buscar IE:", err);
    }
  };

  useEffect(() => {
    fetchIe();
  }, []);

  // const closeModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (name === "cnpj") {
      let v = value.replace(/\D/g, "").slice(0, 14);
      v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
      v = v.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
      setFormData((prev) => ({ ...prev, cnpj: v }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const trataValor = (valor) => valor.replace(/\D/g, "");

  const formatCNPJ = (cnpj) => {
    let v = cnpj.replace(/\D/g, "").slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    return v;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showPopup) return;

    setMessage("");
    setError("");

    const payload = {
      nome: formData.name,
      unit: formData.unit,
      email: formData.email,
      cnpj: trataValor(formData.cnpj),
      notification_email: formData.notification_email,
      darkmode: formData.darkmode
    };

    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/ie/update`;
      console.log(token)
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.status >= 200 && res.status <= 299) {
        setPopupType("success");
        setMessage("Atualização realizada com sucesso!");
        closeModal();
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
        }, 2000);
        fetchIe();
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
        setMessage("Erro ao atualizar dados. Entre em contato com o suporte.");
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

  return (
    <div className="perfil-crud">
      <div className="modal-overlay" onClick={closeModal} ref={overlayRef}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Meu Perfil</h2>
          <div className="modal-body">
            <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} required />
            <input type="text" name="unit" placeholder="Unidade" value={formData.unit} onChange={handleChange} required />
            <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
            <input type="email" name="cnpj" placeholder="CNPJ" value={formData.cnpj} onChange={handleChange} required />

            <div className="switches-container">

              <label className="switch-label">
                Darkmode
                <div className="switch">
                  <input type="checkbox" name="darkmode" checked={formData.darkmode} onChange={handleChange} />
                  <span className="slider"></span>
                </div>
              </label>

              <h4>Notificações:</h4>
              <label className="switch-label">
                Notificação por email
                <div className="switch">
                  <input type="checkbox" name="notification_email" checked={formData.notification_email} onChange={handleChange} />
                  <span className="slider"></span>
                </div>
              </label>

              <label className="switch-label">
                Notificação email aluno cadastrado
                <div className="switch">
                  <input type="checkbox" name="notify_new_student" checked={formData.notify_new_student} onChange={handleChange} />
                  <span className="slider"></span>
                </div>
              </label>

              <label className="switch-label">
                Notificação novas empresas
                <div className="switch">
                  <input type="checkbox" name="notify_new_company" checked={formData.notify_new_company} onChange={handleChange} />
                  <span className="slider"></span>
                </div>
              </label>
            </div>

          </div>
          <div className="modal-footer">
            <button onClick={closeModal} className="btn-cancel">Cancelar</button>
            <button onClick={handleSubmit} className="btn-save">Atualizar</button>
          </div>
        </div>
      </div>

      <PopupMessage type={popupType} message={message} onClose={() => {
        setShowPopup(false);
        setMessage("");
      }} />
    </div>
  );
};

export default Perfil;
