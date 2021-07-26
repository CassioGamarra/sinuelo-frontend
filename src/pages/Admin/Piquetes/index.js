import React, { useEffect, useState } from 'react';  
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import CustomMaterialTable from '../../../components/CustomMaterialTable';
 
import AdicionarPiquete from '../../../components/Forms/Piquetes/Adicionar';
  
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

  const [formOpen, setFormOpen] = useState(false);

  const handleFormChange = () => {
    setFormOpen(!formOpen);
  } 

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'Piquete', field: 'piquete', width: 20 },
    { title: 'Fazenda', field: 'fazenda', width: 250 }, 
    { title: 'Capacidade', field: 'capacidade', width: 20 },
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
      <div className={classes.panels} > 
        {
          !formOpen &&
          <CustomMaterialTable
            titulo={'Piquetes'}
            msgSemDados={'Nenhum piquete cadastrado'}
            colunas={colunas} 
            data={data}
            add={{tooltip: 'Adicionar Piquete', acao: handleFormChange}}
            editar={{tooltip: 'Editar Piquete', acao: console.log}}
            excluir={{tooltip: 'Excluir Piquete', acao: handleDelete}}
          />
        }
        {
          formOpen &&
          <AdicionarPiquete 
            formClose={handleFormChange}
          />
        }
      </div>
    </>
  );
}