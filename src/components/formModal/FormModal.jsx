
import React, { useEffect, useState } from "react";
// import "./FormModal.css";
import "./FormModal.css";

const FormModal = ({
  mode = "view",
  fields = [],
  initialData = {},
  onSubmit,
  onClose,
  actions = []
}) => {
  const [formData, setFormData] = useState({});
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const maskValue = (name, value) => {
    let v = value.replace(/\D/g, "");
    if (name === "cpf") {
      v = v.slice(0, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else if (name === "cnpj") {
      v = v.slice(0, 14).replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    } else if (name === "cep") {
      v = v.slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    } else if (name === "phone") {
      v = v.slice(0, 11).replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    }
    return v;
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const masked = ["cpf", "cnpj", "cep", "phone"].includes(name)
      ? maskValue(name, value)
      : value;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : masked
    }));
  };

  const handleSubmit = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (mode !== "view" && typeof onSubmit === "function") onSubmit(formData);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(), 300);
  };

  const isReadOnly = mode === "view" || mode === "delete";

  return (
    <div className={`form-modal-overlay ${isClosing ? "fade-out" : "fade-in"}`} onClick={handleClose}>
      <div className={`form-modal-content ${isClosing ? "slide-out" : "slide-in"}`} onClick={(e) => e.stopPropagation()}>
        <h2 className="form-modal-title">
          {mode === "create" && "Cadastrar"}
          {mode === "edit" && "Editar"}
          {mode === "view" && "Visualizar"}
          {mode === "delete" && "Excluir"}
        </h2>

        <form onSubmit={handleSubmit} className="form-modal-body">
          {fields.map((field, idx) => {
            if (field.section) {
              return <h4 key={"section-" + idx} className="form-section-title">{field.section}</h4>;
            }
            return (
              <div key={field.name} className={`form-field form-${field.size || "full"}`}>
                <label>{field.label}</label>

                {field.type === "checkbox" ? (
                  <div className="switch">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={!!formData[field.name]}
                      onChange={handleChange}
                      disabled={isReadOnly || field.disabled}
                    />
                    <span className="slider"></span>
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    disabled={isReadOnly || field.disabled}
                  />
                ) : field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    disabled={isReadOnly || field.disabled}
                  >
                    <option value="" disabled>Selecione...</option>
                    {field.options?.map((opt, i) => (
                      <option key={i} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    required={field.required}
                    disabled={isReadOnly || field.disabled}
                  />
                )}
              </div>
            );
          })}

          <div className="form-modal-footer">
            {actions.map((btn, idx) => (
              <button
                key={idx}
                type="button"
                className={btn.className || "btn-save"}
                onClick={() => btn.onClick(formData)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
