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
        <Route exact path="/admin/home" component={HomeAdmin} /> 
        <Route exact path="/admin/fazendas" component={Fazendas} />
        <Route exact path="/admin/piquetes" component={Piquetes} />
        <Route exact path="/admin/funcionarios" component={Funcionarios} /> 
        <Route exact path="/admin/racas" component={Racas} />
        <Route exact path="/admin/animais" component={Animais} />
        <Route exact path="/admin/vacinas" component={Vacinas} />
        <Route exact path="/admin/medicamentos" component={Medicamentos} />
        <Route exact path="/admin/doencas" component={Doencas} />
        <Route exact path="/admin/brincos" component={Brincos} />
        <Route exact path="/admin/alertas" component={Alertas} />
        <Route exact path="/admin/relatorios" component={Relatorios} /> 
      </Switch>
    </BrowserRouter>
  );
}
