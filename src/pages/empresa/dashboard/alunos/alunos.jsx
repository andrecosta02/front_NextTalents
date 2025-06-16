
import React, { useState, useEffect } from "react";
import PopupMessage from "../../../../components/popupMessage/PopupMessage";
import FormModal from "../../../../components/formModal/FormModal";
import "./alunos.css";

const Alunos = () => {
  const [infos, setInfos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchAlunos = async () => {
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/listAll`;
      const res = await fetch(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const dataRes = await res.json();
      console.log(dataRes)
      setInfos(dataRes);
    } catch (err) {
      console.error("Erro ao buscar alunos:", err);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const openModalForEdit = (data) => {
    setFormData({
      ...data,
      birth: data.birth ? data.birth.slice(0, 10) : ""
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const formFields = [
    { name: "name", label: "Nome", type: "text", size: "half", required: true },
    { name: "last_name", label: "Sobrenome", type: "text", size: "half", required: true },
    { name: "name_ie", label: "Instituição de Ensino", type: "text", size: "half", required: true },
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
      <h2>Alunos cadastrados pelas Instituições</h2>

      <div className="cards">
        {infos.map((data) => (
          <div key={data.id} className="card" onClick={() => openModalForEdit(data)}>
            <img src="/aluno.png" alt="Aluno" className="card-img" />
            <p><strong>Nome:</strong> {data.name} {data.last_name}</p>
            <p><strong>Instituição de Ensino:</strong> {data.name_ie}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Telefone:</strong> {data.fone}</p>
            <p><strong>Curso:</strong> {data.curso}</p>
            <p><strong>Cidade:</strong> {data.city} - {data.uf}</p>
            <p><strong>Descrição:</strong> {data.description}</p>
          </div>
        ))}
      </div>

      {modalOpen && (
        <FormModal
          mode={"view"}
          fields={formFields}
          initialData={formData}
          // onSubmit={handleFormSubmit}
          onClose={closeModal}
          actions={[
            { label: "Fechar", onClick: closeModal, className: "btn-cancel" },
            // {
            //   label: isEditing ? "Atualizar" : "Criar Aluno",
            //   onClick: handleFormSubmit,
            //   className: "btn-save"
            // },
            // ...(isEditing ? [{ label: "Excluir", onClick: handleDelete, className: "btn-delete" }] : [])
          ]}
        />
      )}

      <PopupMessage type={popupType} message={message} onClose={() => setMessage("")} />
    </div>
  );
};

export default Alunos;
