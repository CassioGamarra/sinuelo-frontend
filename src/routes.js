import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { isAuthenticated, logout } from './services/auth';

//Pages  
import Login from './pages/Login/index';
import HomeAdmin from './pages/Admin/Home/index'; 
import Fazendas from './pages/Admin/Fazendas/index';
import Piquetes from './pages/Admin/Piquetes/index'; 
import Funcionarios from './pages/Admin/Funcionarios/index';
import Racas from './pages/Admin/Racas/index';
import Animais from './pages/Admin/Animais/index';
import Vacinas from './pages/Admin/Vacinas/index';
import Medicamentos from './pages/Admin/Medicamentos/index';
import Doencas from './pages/Admin/Doencas/index';
import Brincos from './pages/Admin/Brincos/index';
import Alertas from './pages/Admin/Alertas/index';
import Relatorios from './pages/Admin/Relatorios/index'; 

export default function Routes() {
  const PrivateAdmin = ({ component: Component, ...rest }) => (
    <Route
      {...rest}
      render={props =>
        (isAuthenticated()) ? (
          <Component {...props} />
        ) : (
            logout(),
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
      }
    />
  ); 

  return (
    <BrowserRouter>
      <Switch>
        {/*Login*/}   
        <Route exact path="/" component={Login} />
        <PrivateAdmin exact path="/admin/home" component={HomeAdmin} /> 
        <PrivateAdmin exact path="/admin/fazendas" component={Fazendas} />
        <PrivateAdmin exact path="/admin/piquetes" component={Piquetes} />
        <PrivateAdmin exact path="/admin/funcionarios" component={Funcionarios} /> 
        <PrivateAdmin exact path="/admin/racas" component={Racas} />
        <PrivateAdmin exact path="/admin/animais" component={Animais} />
        <PrivateAdmin exact path="/admin/vacinas" component={Vacinas} />
        <PrivateAdmin exact path="/admin/medicamentos" component={Medicamentos} />
        <PrivateAdmin exact path="/admin/doencas" component={Doencas} />
        <PrivateAdmin exact path="/admin/brincos" component={Brincos} />
        <PrivateAdmin exact path="/admin/alertas" component={Alertas} />
        <PrivateAdmin exact path="/admin/relatorios" component={Relatorios} /> 
        <Redirect from="*" to="/" />
      </Switch>
    </BrowserRouter>
  );
}
