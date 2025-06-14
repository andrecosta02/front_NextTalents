import React, { useState, useEffect, useRef } from "react";
import PopupMessage from "../../../../components/PopupMessage";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./perfil.css";

const AlunoCrud = () => {
  const overlayRef = useRef(null);
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");
  // const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const [formData, setFormData] = useState({
  //   id: null,
  //   name: "",
  //   last_name: "",
  //   email: "",
  //   birth: "",
  //   cpf: "",
  //   cep: "",
  //   city: "",
  //   description: ""
  // });

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

  const fetchStudents = async () => {
    try {

      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/list`
      const res = await fetch(url, {
        method: 'get',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });


      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openModalForCreate = () => {
    setFormData({ id: null, name: "", last_name: "", email: "", birth: "", cpf: "", cep: "", city: "", description: "" });
    setIsEditing(false);
    setModalOpen(true);
  };

  const openModalForEdit = (student) => {
    setFormData({
      ...student,
      birth: student.birth ? student.birth.slice(0, 10) : "",
      cpf: student.cpf || ""
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name === "cpf") {
  //     let v = value.replace(/\D/g, "").slice(0, 11);
  //     v = v.replace(/(\d{3})(\d)/, "$1.$2");
  //     v = v.replace(/(\d{3})(\d)/, "$1.$2");
  //     v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  //     setFormData((prev) => ({ ...prev, cpf: v }));
  //   } else {
  //     setFormData((prev) => ({ ...prev, [name]: value }));
  //   }
  // };
  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };



  const formatBirth = (date) => date.replaceAll("-", "");
  const formatCPF = (cpf) => cpf.replace(/\D/g, "");
  const formatCEP = (cep) => cep.replace(/\D/g, "");

  const handleSubmit = async (e) => {
    const endpoint = isEditing ? "update" : "register";
    const method = isEditing ? "PUT" : "POST";
    e.preventDefault();
    if (showPopup) return;

    setMessage("");
    setError("");

    const payload = {
      name: formData.name,
      last_name: formData.last_name,
      email: formData.email,
      birth: formatBirth(formData.birth),
      cpf: formatCPF(formData.cpf),
      cep: formatCEP(formData.cep),
      city: formData.city,
      description: formData.description
    };

    try {
      // setToken(localStorage.getItem("token"))
      // setToken(localStorage.getItem("token"))
      // const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nexttalents/student/register`;
      const aux = isEditing ? `/${formData.id}` : ""
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/${endpoint}${aux}`;
      console.log(token)
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      console.log(url);
      console.log(data);
      console.log(res.status)
      console.log(formData.id)

      if (res.status > 200 && res.status < 299) {
        setPopupType("success");
        if (isEditing) {
          setMessage("Atualização realizada com sucesso!");
        } else {
          setMessage("Cadastro realizado, aluno deve confirmar cadastro no email!");
        }
        closeModal();
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
        }, 8000);
        fetchStudents();
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
        setMessage("Erro ao cadastrar. Entre em contato com o suporte.");
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
    <div className="aluno-crud">
      {/* <h2>Meu Perfil</h2> */}

        <div className="modal-overlay" onClick={closeModal} ref={overlayRef}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Meu Perfil</h2>
            <div className="modal-body">
              <input type="text" name="name" placeholder="Nome" value={formData.name} onChange={handleChange} required />
              <input type="text" name="unit" placeholder="Unidade" value={formData.unit} onChange={handleChange} required />
              <input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required />
              <input type="email" name="cnpj" placeholder="CNPJ" value={formData.cnpj} onChange={handleChange} required />
              {/* <div className="input-row">
                <input type="password" name="pass" placeholder="Senha" value={formData.pass} onChange={handleChange} required />
                <input type="password" name="confirmPass" placeholder="Confirmar Senha" value={formData.confirmPass} onChange={handleChange} required />
              </div> */}

              <div className="switches-container">
                <label className="switch-label">
                  Notificação por email
                  <div className="switch">
                    <input type="checkbox" name="notification_email" checked={formData.notification_email} onChange={handleChange} />
                    <span className="slider"></span>
                  </div>
                </label>

                <label className="switch-label">
                  Darkmode
                  <div className="switch">
                    <input type="checkbox" name="darkmode" checked={formData.darkmode} onChange={handleChange} />
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
              <button onClick={handleSubmit} className="btn-save">{isEditing ? "Salvar" : "Cadastrar"}</button>
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

export default AlunoCrud;
