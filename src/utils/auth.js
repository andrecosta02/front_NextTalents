// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export const getLoggedUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // const decoded = jwt_decode(token);
    const decoded = jwtDecode(token);
    return decoded;
  } catch (e) {
    return null;
  }
};
