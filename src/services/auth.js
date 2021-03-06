export const TOKEN_KEY = "TOKEN"; //Cria o token com o nome
export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null; //Define que a função isAuthenticated recebe o token se não for nulo

export const getToken = () => localStorage.getItem(TOKEN_KEY); //Busca o token no localStorage
export const login = token => { //Salva o token no localStorage
  localStorage.setItem(TOKEN_KEY, token);
}; 
export const logout = () => {//Remove o token do localStorage
  localStorage.clear();
};