
import React, { useState, useEffect } from "react";
import PopupMessage from "../../../../components/popupMessage/PopupMessage";
import FormModal from "../../../../components/formModal/FormModal";
import { useNavigate } from "react-router-dom";
import "./perfil.css";

const Perfil = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    email: "",
    cnpj: "",
    notification_email: false,
    darkmode: false,
    notify_new_student: false,
    notify_new_company: false
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const formatCNPJ = (cnpj) => {
    let v = cnpj.replace(/\D/g, "").slice(0, 14);
    v = v.replace(/(\d{2})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1/$2");
    v = v.replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    return v;
  };

  const trataValor = (valor) => valor.replace(/\D/g, "");

  const fetchEnterprise = async () => {
    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/enterprise/listOne`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();

      console.log(data)

      if (Array.isArray(data) && data.length > 0) {
        const ie = data[0];
        setFormData({
          name: ie.nome || "",
          unit: ie.unit || "",
          email: ie.email || "",
          fone: ie.fone || "",
          city: ie.city || "",
          uf: ie.uf || "",
          country: ie.country || "",
          cnpj: formatCNPJ(ie.cnpj || ""),
          notification_email: !!ie.notification_email,
          darkmode: !!ie.darkmode,
          notify_new_student: !!ie.notify_new_student,
          notify_new_company: !!ie.notify_new_company
        });
      }
    } catch (err) {
      console.error("Erro ao buscar IE:", err);
    }
  };

  useEffect(() => {
    fetchEnterprise();
  }, []);

  const handleSubmit = async (data) => {
    const payload = {
      nome: data.name,
      unit: data.unit,
      email: data.email,
      cnpj: trataValor(data.cnpj),
      notification_email: data.notification_email,
      darkmode: data.darkmode
    };

    try {
      const url = `http://${process.env.REACT_APP_IP_SERVER}:${process.env.REACT_APP_PORT_SERVER}/nextTalents/enterprise/update`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.status >= 200 && res.status <= 299) {
        setPopupType("success");
        setMessage("Atualização realizada com sucesso!");
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          setMessage("");
          closeModal();
        }, 2000);
        fetchEnterprise();
      } else if (res.status === 422 && result.errors) {
        setPopupType("error");
        setMessage(result.errors[0].msg);
        setShowPopup(true);
      } else {
        setPopupType("error");
        setMessage("Erro ao atualizar dados. Entre em contato com o suporte.");
        setShowPopup(true);
      }
    } catch (err) {
      setPopupType("error");
      setMessage("Erro de conexão com o servidor.");
      setShowPopup(true);
    }
  };

  const fields = [
    { name: "name", label: "Nome", type: "text", size: "full", required: true },
    { name: "unit", label: "Unidade", type: "text", size: "full" },
    { name: "email", label: "E-mail", type: "email", size: "full", required: true },
    { name: "cnpj", label: "CNPJ", type: "text", size: "full" },
    { name: "fone", label: "Telefone", type: "text", size: "full" },
    
    { name: "city", label: "Cidade", type: "text", size: "half" },
    { name: "uf", label: "UF", type: "text", size: "half" },
    { name: "country", label: "Pais", type: "text", size: "half" },

    { name: "darkmode", label: "Darkmode", type: "checkbox", size: "full" },
    { section: "Notificações" },
    { name: "notification_email", label: "Notificação por email", type: "checkbox" },    
    { name: "notify_new_student", label: "Notificação email aluno cadastrado", type: "checkbox" },
    { name: "notify_new_company", label: "Notificação novas empresas", type: "checkbox" }
  ];

  return (
    <div className="perfil-wrapper">
      <FormModal
        mode="edit"
        fields={fields}
        initialData={formData}
        onSubmit={handleSubmit}
        onClose={closeModal}
        actions={[
          { label: "Cancelar", onClick: navigate("/empresa/dashboard"), className: "btn-cancel" },
          { label: "Atualizar", onClick: handleSubmit, className: "btn-save" }
        ]}
      />

      <PopupMessage
        type={popupType}
        message={message}
        onClose={() => setShowPopup(false)}
      />
    </div>
  );
};

export default Perfil;
