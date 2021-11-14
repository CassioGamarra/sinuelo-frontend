import React, { useEffect, useState } from 'react';  
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth';
import api from '../../../services/api';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../utils/showToast';  
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import CustomMaterialTable from '../../../components/CustomMaterialTable';
 
import AdicionarAnimal from '../../../components/Forms/Animais/Adicionar';
import EditarAnimal from '../../../components/Forms/Animais/Editar';
  
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
  const token = localStorage.getItem('TOKEN');
  const history = useHistory();
  const classes = useStyles(); 
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [formCadastroOpen, setFormCadastroOpen] = useState(false);

  const handleFormCadastroChange = () => {
    setFormCadastroOpen(!formCadastroOpen);
  }
  
  const [formEditarOpen, setFormEditarOpen] = useState(false);

  const handleFormEditarChange = () => { 
    setFormEditarOpen(!formEditarOpen);
  } 
  /**
   * Dialog para realizar o cadastro de uma fazenda
   */

  const [formOpen, setFormOpen] = useState(false);

  const handleFormChange = () => {
    setFormOpen(!formOpen);
  } 

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'NOME', field: 'nome', width: 250 }, 
    { title: 'BRINCO', field: 'brinco', width: 250 }, 
    { title: 'PESO ORIGINAL', field: 'peso_original', width: 250 }, 
    { title: 'PESO ATUAL', field: 'peso_atual', width: 250 }, 
    { title: 'RAÇA', field: 'raca', width: 250 }, 
    { title: 'SEXO', field: 'sexo', width: 250 }, 
  ];
 
  const [data, setData] = useState([]);

  const [idAnimal, setIdAnimal] = useState('');

  function handleLogout() {
    logout();
    history.push('/');
  } 

  useEffect(() => {
    buscarAnimais();
  }, []);

  async function buscarAnimais() {
    handleOpen();
    try {
      const getAnimais = await api.get('/animais', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose(); 
      setData(getAnimais.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          swal({
            title: 'Atenção',
            text: 'Sua sessão expirou, por favor, realize login novamente!',
            icon: "info",
            buttons: "OK"
          }).then((willSuccess) => {
            handleClose();
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  } 
 
  async function handleDelete(id) {
    swal({
      title: "Deseja excluir o animal?",
      icon: "warning", 
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deletaBrinco(id);
      }
    });
  }

  async function deletaBrinco(id) {  
    handleOpen();
    try {
      const callBackPost = await api.delete(`/animais/${id}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            buscarAnimais();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            buscarAnimais(); 
          });
        }
      }
    }
    catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          swal({
            title: 'Atenção',
            text: 'Sua sessão expirou, por favor, realize login novamente!',
            icon: "info",
            buttons: "OK"
          }).then((willSuccess) => {
            handleClose();
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  } 

  return (
    <>
      <Header
        logout={handleLogout}
      />
      <ToastAnimated />
      <div className={classes.panels} > 
        {
          (!formCadastroOpen && !formEditarOpen) &&
          <CustomMaterialTable
            titulo={'Animais'}
            msgSemDados={'Nenhuma animal cadastrada'}
            colunas={colunas} 
            data={data}
            add={{ tooltip: 'Adicionar Animal', acao: handleFormCadastroChange }}
              editar={{ tooltip: 'Editar Animal', acao: handleFormEditarChange, setId: setIdAnimal }}
              excluir={{ tooltip: 'Excluir Animal', acao: handleDelete }}
          />
        }
        {
          formCadastroOpen &&
          <AdicionarAnimal
            formClose={handleFormCadastroChange}
            handleLogout={handleLogout}
            buscarAnimais={buscarAnimais}
          />
        }
        {
          formEditarOpen &&
          <EditarAnimal
            idAnimal={idAnimal}
            formClose={handleFormEditarChange}
            handleLogout={handleLogout}
            buscarAnimais={buscarAnimais}
          />
        }
      </div>
    </>
  );
}