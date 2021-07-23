import React, { useEffect, useState } from 'react';  
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import CustomMaterialTable from '../../../components/CustomMaterialTable';

//Icones dos menus
import fazendas from '../../../assets/icones/fazendas.svg'; 
  
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

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'Fazenda', field: 'fazenda', width: 20 },
    { title: 'Localização', field: 'localizacao', width: 250 },
    { title: 'Nº de animais', field: 'num_animais', width: 20 },];

  const data = [{
    id: 1,
    fazenda: 'Do boqueirão',
    localizacao: 'São Luiz Gonzaga',
    num_animais: '300'
  }]  
  function handleLogout() {
    logout();
    history.push('/');
  } 

  async function handleDelete(id) {
    swal({
      title: "Deseja excluir a fazenda?",
      icon: "warning", 
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        console.log('Excluir: '+id)
      }
    });
  }

  return (
    <>
      <Header
        logout={handleLogout}
      />
      <ToastAnimated />
      <div className={classes.panels}> 
        <CustomMaterialTable
          titulo={'Fazendas'}
          msgSemDados={'Nenhuma fazenda cadastrada'}
          colunas={colunas} 
          data={data}
          add={{tooltip: 'Adicionar Fazenda', acao: () => console.log('Adicionar')}}
          editar={{tooltip: 'Editar Fazenda', acao: console.log}}
          excluir={{tooltip: 'Excluir Fazenda', acao: handleDelete}}
        />
      </div>
    </>
  );
}