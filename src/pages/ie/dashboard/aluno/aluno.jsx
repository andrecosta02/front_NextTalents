import React, { useState, useEffect, useRef } from "react";
import PopupMessage from "../../../../components/PopupMessage";
import "./aluno.css";

const AlunoCrud = () => {
  const overlayRef = useRef(null);

  const [mensagem, setMensagem] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success"); // ou "error"
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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


  const fetchStudents = async () => {
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/list`
      const res = await fetch(url);
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

  const handleSave = async () => {
    const endpoint = isEditing ? "update" : "register";
    const method = isEditing ? "PUT" : "POST";
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/${endpoint}`;
      const response = await fetch( url,
      {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, birth: formData.birth.replace(/-/g, "") })
      }
      );

      console.log(response)

      if (response.ok) {
        // setMensagem('se existir cadastro um email sera enviado');

        setPopupType("success");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 5000);
        
        fetchStudents();
        closeModal();
      } else {
        setMensagem('Erro no cadastro do aluno.');
      }

    } catch (err) {
      console.error(`Erro ao ${isEditing ? "atualizar" : "cadastrar"} aluno:`, err);
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return;
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/student/delete`;
        const response = await fetch( url,
          { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: formData.id }) }
        );
        fetchStudents();
        closeModal();
      } catch (err) {
        console.error("Erro ao excluir aluno:", err);
      }
    }
  };

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

      {modalOpen && (
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
              <button onClick={handleSave} className="btn-save">{isEditing ? "Salvar" : "Cadastrar"}</button>
            </div>
          </div>
        </div>
      )}

      <PopupMessage
        type={popupType}
        message={message}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default AlunoCrud;
