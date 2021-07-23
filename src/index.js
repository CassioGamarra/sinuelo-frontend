import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  //<React.StrictMode>
    <App />,
  //</React.StrictMode>,
  document.getElementById('root')
);

/*
o StrictMode não renderiza nenhum elemento visível na interface. 
Ele ativa, no entanto, verificações e avisos adicionais para os seus descendentes.
*/