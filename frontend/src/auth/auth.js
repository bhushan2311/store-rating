export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const cleanLocalStorage = () => {
  localStorage.clear();
};
