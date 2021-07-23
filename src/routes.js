import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { isAuthenticated, logout } from './services/auth';

//Pages  
import Login from './pages/Login/index';
import HomeAdmin from './pages/Admin/Home/index'; 

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
      </Switch>
    </BrowserRouter>
  );
}