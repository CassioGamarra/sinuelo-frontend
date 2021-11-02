import React, { useEffect, useState } from 'react';  
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
//Material UI
import api from '../../../services/api';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../utils/showToast';  
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomMaterialTable from '../../../components/CustomMaterialTable';
 
import AdicionarFuncionario from '../../../components/Forms/Funcionarios/Adicionar';
  
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

  const colunas = [
    { title: 'id', field: 'id', hidden: true },
    { title: 'Funcionário', field: 'nome', width: 20 },
    { title: 'Usuário', field: 'usuario', width: 250 },
    { title: 'Ativo', field: 'ativo', width: 20 },];

  const [data, setData] = useState([]);

  const [idFuncionario, setIdFuncionario] = useState(''); 

  function handleLogout() {
    logout();
    history.push('/');
  } 

  useEffect(() => {
    buscarFuncionarios(); 
  }, []);
 
  async function buscarFuncionarios() {
    handleOpen();
    try {
      const getFuncionarios = await api.get('/funcionarios', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setData(getFuncionarios.data);
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
      title: "Deseja excluir o funcionário?",
      icon: "warning", 
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deletaFuncionario(id);
      }
    });
  }

  async function deletaFuncionario(id) {  
    handleOpen();
    try {
      const callBackPost = await api.delete(`/funcionarios/${idFuncionario}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            buscarFuncionarios();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            buscarFuncionarios(); 
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
          <>
            <CustomMaterialTable
              titulo={'Funcionários'}
              msgSemDados={'Nenhuma funcionário cadastrado'}
              colunas={colunas} 
              data={data}
              add={{tooltip: 'Adicionar Funcionário', acao: handleFormCadastroChange}}
              editar={{tooltip: 'Editar Funcionário', acao: handleFormEditarChange, setId: setIdFuncionario}}
              excluir={{tooltip: 'Excluir Funcionário', acao: handleDelete}}
            />
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        }
        {
          formCadastroOpen &&
          <AdicionarFuncionario 
            formClose={handleFormCadastroChange} 
            handleLogout={handleLogout}
            buscarFuncionarios={buscarFuncionarios}
          />
        }
        {
          /*formEditarOpen &&
          <EditarFuncionario 
            idFuncionario={idFuncionario}
            formClose={handleFormEditarChange}
            handleLogout={handleLogout}
            buscarFuncionarios={buscarFuncionarios} 
          />*/
        }
      </div>
    </>
  );
}