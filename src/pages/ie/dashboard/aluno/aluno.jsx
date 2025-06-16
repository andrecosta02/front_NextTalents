
import React, { useState, useEffect } from "react";
import PopupMessage from "../../../../components/popupMessage/PopupMessage";
import FormModal from "../../../../components/formModal/FormModal";
import "./aluno.css";

const AlunoCrud = () => {
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchStudents = async () => {
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/list`;
      const res = await fetch(url, {
        method: "get",
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
    setFormData({
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
    setIsEditing(false);
    setModalOpen(true);
  };

  const openModalForEdit = (student) => {
    setFormData({
      ...student,
      birth: student.birth ? student.birth.slice(0, 10) : ""
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const formatDate = (d) => d.replaceAll("-", "");
  const numeric = (str) => str.replace(/\D/g, "");

  const handleFormSubmit = async (data) => {
    const method = isEditing ? "PUT" : "POST";
    const endpoint = isEditing ? "update" : "register";
    const payload = {
      name: data.name,
      last_name: data.last_name,
      email: data.email,
      fone: data.fone,
      curso: data.curso,
      birth: formatDate(data.birth),
      cpf: numeric(data.cpf),
      cep: numeric(data.cep),
      city: data.city,
      uf: data.uf,
      country: data.country,
      description: data.description
    };
    const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/${endpoint}${isEditing ? "/" + data.id : ""}`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data2 = await res.json();
      console.log(data2)
      console.log(payload)
      if (res.ok) {
        setPopupType("success");
        setMessage(isEditing ? "Atualizado com sucesso!" : "Cadastrado com sucesso!");
        fetchStudents();
        closeModal();
      } else {
        setPopupType("error");
        setMessage("Erro ao salvar.");
      }
    } catch {
      setPopupType("error");
      setMessage("Erro de conexão.");
    }
  };

  const handleDelete = async (data) => {
    if (!data.id) return;
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/delete/${data.id}`;
      await fetch(url, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setPopupType("success");
      setMessage("Aluno deletado!");
      fetchStudents();
      closeModal();
    } catch {
      setPopupType("error");
      setMessage("Erro ao deletar.");
    }
  };

  const formFields = [
    { name: "name", label: "Nome", type: "text", size: "half", required: true },
    { name: "last_name", label: "Sobrenome", type: "text", size: "half", required: true },
    { name: "email", label: "Email", type: "email", size: "half", required: true },
    { name: "fone", label: "Telefone", type: "text", size: "half", required: true },
    { name: "curso", label: "Curso", type: "text", size: "full", required: true },
    { name: "birth", label: "Nascimento", type: "date", size: "half" },
    { name: "cpf", label: "CPF", type: "text", size: "half" },
    { name: "cep", label: "CEP", type: "text", size: "half" },
    { name: "city", label: "Cidade", type: "text", size: "half" },
    { name: "uf", label: "Estado", type: "select", size: "half", required: true,
      options: [
        { label: "Acre", value: "AC" },
        { label: "Alagoas", value: "AL" },
        { label: "Amapá", value: "AP" },
        { label: "Amazonas", value: "AM" },
        { label: "Bahia", value: "BA" },
        { label: "Ceará", value: "CE" },
        { label: "Distrito Federal", value: "DF" },
        { label: "Espírito Santo", value: "ES" },
        { label: "Goiás", value: "GO" },
        { label: "Maranhão", value: "MA" },
        { label: "Mato Grosso", value: "MT" },
        { label: "Mato Grosso do Sul", value: "MS" },
        { label: "Minas Gerais", value: "MG" },
        { label: "Pará", value: "PA" },
        { label: "Paraíba", value: "PB" },
        { label: "Paraná", value: "PR" },
        { label: "Pernambuco", value: "PE" },
        { label: "Piauí", value: "PI" },
        { label: "Rio de Janeiro", value: "RJ" },
        { label: "Rio Grande do Norte", value: "RN" },
        { label: "Rio Grande do Sul", value: "RS" },
        { label: "Rondônia", value: "RO" },
        { label: "Roraima", value: "RR" },
        { label: "Santa Catarina", value: "SC" },
        { label: "São Paulo", value: "SP" },
        { label: "Sergipe", value: "SE" },
        { label: "Tocantins", value: "TO" }
      ]
    },
    { name: "country", label: "Pais", type: "text", size: "half" },
    { name: "description", label: "Descrição", type: "textarea", size: "full" },
  ];

  return (
    <div className="aluno-crud">
      <h2>Alunos</h2>
      <button className="btn-add" onClick={openModalForCreate}>+</button>

      <div className="cards">
        {students.map((student) => (
          <div key={student.id} className="card" onClick={() => openModalForEdit(student)}>
            <img src="/aluno.png" alt="Aluno" className="card-img" />
            <p><strong>Nome:</strong> {student.name} {student.last_name}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Telefone:</strong> {student.fone}</p>
            <p><strong>Curso:</strong> {student.curso}</p>
            <p><strong>Cidade:</strong> {student.city} - {student.uf}</p>
            <p><strong>Descrição:</strong> {student.description}</p>
          </div>
        ))}
      </div>

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

      <PopupMessage type={popupType} message={message} onClose={() => setMessage("")} />
    </div>
  );
};

export default AlunoCrud;
