const setAuth = auth => {
    if (auth && auth.token) {
      localStorage.setItem('authToken', auth.token);  
    }
  };
   const removeAuth = () => {
    localStorage.removeItem('authToken'); 
  };
  
  const getAuth = () => {
    const token = localStorage.getItem("authToken");
    return token ? { token } : undefined;
  };
  
  export { getAuth, removeAuth, setAuth };