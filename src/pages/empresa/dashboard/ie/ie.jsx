
import React, { useState, useEffect } from "react";
import PopupMessage from "../../../../components/popupMessage/PopupMessage";
import FormModal from "../../../../components/formModal/FormModal";
import "./ie.css";

const Ie = () => {
  const [infos, setInfos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchIe = async () => {
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/ie/list`;
      const res = await fetch(url, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const dataRes = await res.json();
      setInfos(dataRes);
    } catch (err) {
      console.error("Erro ao buscar IE's:", err);
    }
  };

  useEffect(() => {
    fetchIe();
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
    { name: "nome", label: "Nome", type: "text", size: "half" },
    { name: "unit", label: "Unidade", type: "text", size: "full" },
    { name: "email", label: "E-mail", type: "email", size: "full" },
    { name: "fone", label: "Fone", type: "text", size: "half" },
    { name: "cnpj", label: "CNPJ", type: "text", size: "half" },

    { name: "city", label: "City", type: "text", size: "half" },
    { name: "uf", label: "UF", type: "text", size: "half" },
    { name: "country", label: "Pais", type: "text", size: "half" }
  ];

  return (
    <div className="aluno-crud">
      <h2>Instituições de Ensino disponíveis</h2>

      <div className="cards">
        {infos.map((data) => (
          <div key={data.id} className="card" onClick={() => openModalForEdit(data)}>
            <img src="/instituicao.png" alt="instituicao" className="card-img" />
            <p><strong>Nome:</strong> {data.nome}</p>
            <p><strong>Unidade:</strong> {data.unit}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Telefone:</strong> {data.fone}</p>
            <p><strong>CNPJ:</strong> {data.cnpj}</p>
            <p><strong>Cidade:</strong> {data.city} - {data.uf}</p>
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

export default Ie;
