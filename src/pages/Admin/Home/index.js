import React, { useEffect, useState } from 'react'; 
import './styles.css';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'; 
import Grid from '@material-ui/core/Grid'; 
import CardButton from '../../../components/CardButton';

//Icones dos menus
import fazendas from '../../../assets/icones/fazendas.svg';
import piquetes from '../../../assets/icones/piquetes.svg';
import funcionarios from '../../../assets/icones/funcionarios.svg';
import racas from '../../../assets/icones/racas.svg';
import animais from '../../../assets/icones/animais.svg';
import vacinas from '../../../assets/icones/vacinas.svg';
import medicamentos from '../../../assets/icones/medicamentos.svg';
import doencas from '../../../assets/icones/doencas.svg';
import brincos from '../../../assets/icones/brincos.svg';
import alertas from '../../../assets/icones/alertas.svg';
import relatorios from '../../../assets/icones/relatorios.svg';
  
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  panels: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  }, 
  title: {
    fontSize: theme.typography.pxToRem(32),
    fontWeight: 500, 
    color: '#004725',
    padding: '0.5em',
    fontFamily: 'Bebas Neue'
  },
}));

export default function Home() {
  const history = useHistory();
  const classes = useStyles(); 

  function handleLogout() {
    logout();
    history.push('/');
  }

  const menus = [
    {
      icone: fazendas,
      titulo: 'Fazendas',
      url: 'fazendas'
    },
    {
      icone: piquetes,
      titulo: 'Piquetes',
      url: 'piquetes'
    },
    {
      icone: funcionarios,
      titulo: 'Funcionários',
      url: 'funcionarios'
    },
    {
      icone: racas,
      titulo: 'Raças',
      url: 'racas'
    },
    {
      icone: animais,
      titulo: 'Animais',
      url: 'animais'
    },
    {
      icone: vacinas,
      titulo: 'Vacinas',
      url: 'vacinas'
    },
    {
      icone: medicamentos,
      titulo: 'Medicamentos',
      url: 'medicamentos'
    },
    {
      icone: doencas,
      titulo: 'Doenças',
      url: 'doencas'
    },
    {
      icone: brincos,
      titulo: 'Brincos',
      url: 'brincos'
    },
    {
      icone: alertas,
      titulo: 'Alertas',
      url: 'alertas'
    },
    {
      icone: relatorios,
      titulo: 'Relatórios',
      url: 'relatorios'
    }
  ]

  return (
    <>
      <Header
        logout={handleLogout}
      />
      <ToastAnimated />
      <div className={classes.panels}>
        <Typography variant="h1" className={classes.title}>
          BEM VINDO, ADMINISTRADOR.
        </Typography> 

        <Grid container spacing={1} style={{width: '100%'}}>
        {
          menus.map((v, index) => (
              <Grid key={index} item xs={12} sm={6} md={6} lg={4} xl={3} > 
                <CardButton icone={v.icone} titulo={v.titulo} url={v.url}/> 
              </Grid> 
          ))
        } 
        </Grid>
      </div>
    </>
  );
}