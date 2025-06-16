import React, { useState, useEffect, useRef } from "react";
import PopupMessage from "../../../../components/popupMessage/PopupMessage";
import { useNavigate } from "react-router-dom";
import FormModal from "../../../../components/formModal/FormModal";

import { jwtDecode } from "jwt-decode";
import "./aluno.css";

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
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    last_name: "",
    email: "",
    birth: "",
    cpf: "",
    cep: "",
    city: "",
    description: ""
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

      console.log(res)
      
      const data = await res.json();
      console.log(data)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      let v = value.replace(/\D/g, "").slice(0, 11);
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      setFormData((prev) => ({ ...prev, cpf: v }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatBirth = (date) => date.replaceAll("-", "");
  const formatCPF = (cpf) => cpf.replace(/\D/g, "");
  const formatCEP = (cep) => cep.replace(/\D/g, "");

  // const handleSubmit = async (e) => {
  //   const endpoint = isEditing ? "update" : "register";
  //   const method = isEditing ? "PUT" : "POST";
  //   e.preventDefault();
  //   if (showPopup) return;

  //   setMessage("");
  //   setError("");

  //   const payload = {
  //     name: formData.name,
  //     last_name: formData.last_name,
  //     email: formData.email,
  //     birth: formatBirth(formData.birth),
  //     cpf: formatCPF(formData.cpf),
  //     cep: formatCEP(formData.cep),
  //     city: formData.city,
  //     description: formData.description
  //   };

  //   try {
  //     // setToken(localStorage.getItem("token"))
  //     // setToken(localStorage.getItem("token"))
  //     // const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nexttalents/student/register`;
  //     const aux = isEditing ? `/${formData.id}` : ""
  //     const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/${endpoint}${aux}`;
  //     console.log(token)
  //     const res = await fetch(url, {
  //       method,
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${token}`
  //       },
  //       body: JSON.stringify(payload)
  //     });

  //     const data = await res.json();
  //     console.log(url);
  //     console.log(data);
  //     console.log(res.status)
  //     console.log(formData.id)

  //     if (res.status > 200 && res.status < 299) {
  //       setPopupType("success");
  //       if (isEditing) {
  //         setMessage("Atualização realizada com sucesso!");
  //       } else {
  //         setMessage("Cadastro realizado, aluno deve confirmar cadastro no email!");
  //       }
  //       closeModal();
  //       setShowPopup(true);
  //       setTimeout(() => {
  //         setShowPopup(false);
  //         setMessage("");
  //       }, 8000);
  //       fetchStudents();
  //     } else if (res.status === 422 && data.errors) {
  //       setPopupType("error");
  //       setMessage(data.errors[0].msg);
  //       setShowPopup(true);
  //       setTimeout(() => {
  //         setShowPopup(false);
  //         setMessage("");
  //       }, 10000);
  //     } else {
  //       setPopupType("error");
  //       setMessage("Erro ao cadastrar. Entre em contato com o suporte.");
  //       setShowPopup(true);
  //       setTimeout(() => {
  //         setShowPopup(false);
  //         setMessage("");
  //       }, 10000);
  //     }
  //   } catch (err) {
  //     setPopupType("error");
  //     setMessage("Erro de conexão com o servidor.");
  //     setShowPopup(true);
  //     setTimeout(() => {
  //       setShowPopup(false);
  //       setMessage("");
  //     }, 10000);
  //   }
  // };

  const handleFormSubmit = async (data) => {
    const endpoint = isEditing ? "update" : "register";
    const method = isEditing ? "PUT" : "POST";
    if (showPopup) return;

    setMessage("");
    setError("");

    const payload = {
      name: data.name,
      last_name: data.last_name,
      email: data.email,
      birth: formatBirth(data.birth),
      cpf: formatCPF(data.cpf),
      cep: formatCEP(data.cep),
      city: data.city,
      description: data.description
    };

    try {
      const aux = isEditing ? `/${data.id}` : "";
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/${endpoint}${aux}`;
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json();

      if (res.status >= 200 && res.status < 300) {
        setPopupType("success");
        setMessage(isEditing ? "Atualização realizada com sucesso!" : "Cadastro realizado!");
        closeModal();
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
        }, 8000);
        fetchStudents();
      } else if (res.status === 422 && responseData.errors) {
        setPopupType("error");
        setMessage(responseData.errors[0].msg);
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
        }, 10000);
      } else {
        throw new Error();
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


  // const handleDelete = async () => {
  //   if (!isEditing) return;
  //   if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
  //     try {
  //       console.log(token)
  //       const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/delete/${formData.id}`
  //       const res = await fetch(url, {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": `Bearer ${token}`
  //         }
  //       });

  //       setPopupType("success");
  //       setMessage("Aluno deletado com sucesso!");
  //       setShowPopup(true);
  //       setTimeout(() => {
  //         setShowPopup(false);
  //         setMessage("");
  //       }, 8000);

  //       fetchStudents();
  //       closeModal();
  //     } catch (err) {
  //       console.error("Erro ao excluir aluno:", err);
  //     }
  //   }
  // };

  const handleDelete = async (data) => {
    if (!data.id) return;

    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/delete/${data.id}`;
        const res = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (res.ok) {
          setPopupType("success");
          setMessage("Aluno deletado com sucesso!");
          setShowPopup(true);
          setTimeout(() => {
            setShowPopup(false);
            setMessage("");
          }, 8000);
          fetchStudents();
          closeModal();
        } else {
          throw new Error();
        }
      } catch (err) {
        console.error("Erro ao excluir aluno:", err);
        setPopupType("error");
        setMessage("Erro ao excluir. Tente novamente.");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
        }, 8000);
      }
    }
  };


  const formFields = [
    { name: "name", label: "Nome", type: "text", size: "half", required: true },
    { name: "last_name", label: "Sobrenome", type: "text", size: "half", required: true },
    { name: "email", label: "Email", type: "email", size: "full", required: true },
    { name: "birth", label: "Nascimento", type: "date", size: "half", required: true },
    { name: "cpf", label: "CPF", type: "text", size: "half", required: true },
    { name: "cep", label: "CEP", type: "text", size: "half" },
    { name: "city", label: "Cidade", type: "text", size: "half" },
    { name: "description", label: "Descrição", type: "textarea", size: "full" }
  ];

  return (
    <div className="aluno-crud">
      <h2>Alunos</h2>
      <button
        onClick={openModalForCreate}
        className="btn-add"
      >
        +
      </button>

      <div className="cards">
        {students.length === 0 ? (
          <p>Carregando ou nenhum aluno encontrado.</p>
        ) : (
          students.map((student) => (
            <div key={student.id} className="card" onClick={() => openModalForEdit(student)}>
              <img src="/aluno.png" alt="Aluno" className="card-img" />
              <p><strong>Nome:</strong> {student.name} {student.last_name}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Nascimento:</strong> {new Date(student.birth).toLocaleDateString()}</p>
              <p><strong>Cidade:</strong> {student.city} (<strong>CEP:</strong> {student.cep})</p>
              <p><strong>Descrição:</strong> {student.description}</p>
            </div>
          ))
        )}
      </div>

      {/* {modalOpen && (
        <div className="modal-overlay" onClick={closeModal} ref={overlayRef}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{isEditing ? "Editar Aluno" : "Cadastrar Aluno"}</h2>
            <div className="modal-body">
              <input name="name" placeholder="Nome" value={formData.name} onChange={handleChange} />
              <input name="last_name" placeholder="Sobrenome" value={formData.last_name} onChange={handleChange} />
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <input name="birth" type="date" placeholder="Nascimento" value={formData.birth} onChange={handleChange} />
              <input name="cpf" placeholder="CPF" value={formData.cpf} onChange={handleChange} />
              <input name="cep" placeholder="CEP" value={formData.cep} onChange={handleChange} />
              <input name="city" placeholder="Cidade" value={formData.city} onChange={handleChange} />
              <textarea name="description" placeholder="Descrição" value={formData.description} onChange={handleChange} />
            </div>
            <div className="modal-footer">
              {isEditing && <button onClick={handleDelete} className="btn-delete">Excluir</button>}
              <button onClick={closeModal} className="btn-cancel">Cancelar</button>
              <button onClick={handleSubmit} className="btn-save">{isEditing ? "Salvar" : "Cadastrar"}</button>
            </div>
          </div>
        </div>
      )} */}

      {/* {modalOpen && (
        // <FormModal
        //   mode={isEditing ? "edit" : "create"}
        //   fields={formFields}
        //   initialData={formData}
        //   onSubmit={handleSubmit}
        //   onClose={closeModal}
        //   actions={{
        //     delete: isEditing ? handleDelete : undefined
        //   }}
        // />
        <FormModal
          mode={isEditing ? "edit" : "create"}
          fields={formFields}
          initialData={formData}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
          actions={{
            delete: isEditing ? handleDelete : undefined
          }}
        />
      )} */}

      {modalOpen && (
        <FormModal
          mode={isEditing ? "edit" : "create"}
          fields={formFields}
          initialData={formData}
          onSubmit={handleFormSubmit}
          onClose={closeModal}
          actions={[
            { label: "Cancelar", onClick: closeModal, className: "btn-cancel" },
            {
              label: isEditing ? "Atualizar" : "Criar Aluno",
              onClick: handleFormSubmit,
              className: "btn-save"
            },
            ...(isEditing ? [{ label: "Excluir", onClick: handleDelete, className: "btn-delete" }] : [])
          ]}
        />
      )}

      <PopupMessage type={popupType} message={message} onClose={() => {
        setShowPopup(false);
        setMessage("");
      }} />
    </div>
  );
};

export default AlunoCrud;
