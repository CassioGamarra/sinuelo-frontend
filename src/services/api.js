import axios from 'axios';

/* Possui 4 urls:
* 1 - Produção
* 2 - IP Localhost
* 3 - Localhost
* 4 - Dev
*/ 
const api = axios.create({ 
  //baseURL: 'https://gestante-do-zap-api.herokuapp.com'
  baseURL: 'http://127.0.0.1:3333'
});

export default api