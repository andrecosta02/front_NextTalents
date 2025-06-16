
import React, { useState, useEffect } from "react";
import PopupMessage from "../../../../components/popupMessage/PopupMessage";
import FormModal from "../../../../components/formModal/FormModal";
import "./empresas.css";

const Empresa = () => {
  const [infos, setInfos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const fetchIe = async () => {
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/enterprise/list`;
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
      console.error("Erro ao buscar empresas:", err);
    }
  };

  useEffect(() => {
    fetchIe();
  }, []);

  // const openModalForCreate = () => {
  //   setFormData({
  //     id: null,
  //     name: "",
  //     last_name: "",
  //     email: "",
  //     birth: "",
  //     cpf: "",
  //     cep: "",
  //     city: "",
  //     description: ""
  //   });
  //   setIsEditing(false);
  //   setModalOpen(true);
  // };

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
    { name: "unit", label: "Unidade", type: "email", size: "full" },
    { name: "cnpj", label: "CNPJ", type: "text", size: "half" },
    { name: "cep", label: "CEP", type: "text", size: "half" },
    { name: "cnpj", label: "Cnpj", type: "text", size: "half" }
  ];

  return (
    <div className="aluno-crud">
      <h2>Empresas parceiras</h2>

      <div className="cards">
        {infos.map((data) => (
          <div key={data.id} className="card" onClick={() => openModalForEdit(data)}>
            <img src="/empresa.png" alt="Aluno" className="card-img" />
            <p><strong>Nome:</strong> {data.nome}</p>
            <p><strong>Unidade:</strong> {data.unit}</p>
            <p><strong>Email:</strong> {data.email}</p>
            <p><strong>Cnpj:</strong> {data.cnpj}</p>
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

export default Empresa;
