import React, { useEffect, useState } from 'react';  
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import CustomMaterialTable from '../../../components/CustomMaterialTable';
 
import AdicionarAnimal from '../../../components/Forms/Animais/Adicionar';
  
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

  /**
   * Dialog para realizar o cadastro de uma fazenda
   */

  const [formOpen, setFormOpen] = useState(false);

  const handleFormChange = () => {
    setFormOpen(!formOpen);
  } 

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'NOME', field: 'localizacao', width: 250 }, 
    { title: 'BRINCO', field: 'localizacao', width: 250 }, 
    { title: 'PESO ORIGINAL', field: 'localizacao', width: 250 }, 
    { title: 'PESO ATUAL', field: 'localizacao', width: 250 }, 
    { title: 'RAÇA', field: 'localizacao', width: 250 }, 
    { title: 'SEXO', field: 'localizacao', width: 250 }, ];

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
            titulo={'Animais'}
            msgSemDados={'Nenhuma animal cadastrada'}
            colunas={colunas} 
            data={data}
            add={{tooltip: 'Adicionar Animal', acao: handleFormChange}}
            editar={{tooltip: 'Editar Animal', acao: console.log}}
            excluir={{tooltip: 'Excluir Animal', acao: handleDelete}}
          />
        }
        {
          formOpen &&
          <AdicionarAnimal 
            formClose={handleFormChange}
          />
        }
      </div>
    </>
  );
}