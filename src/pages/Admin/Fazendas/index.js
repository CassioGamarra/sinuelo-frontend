import React, { useEffect, useState } from 'react';  
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth';
import api from '../../../services/api';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../utils/showToast'; 
//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomMaterialTable from '../../../components/CustomMaterialTable';
 
import AdicionarFazenda from '../../../components/Forms/Fazendas/Adicionar';
import EditarFazenda from '../../../components/Forms/Fazendas/Editar';
  
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
    { title: 'Fazenda', field: 'nome', width: 20 },
    { title: 'Localização', field: 'localizacao', width: 250 },
    { title: 'Nº de animais', field: 'num_animais', width: 20 },];

  const [data, setData] = useState([]);

  const [idFazenda, setIdFazenda] = useState(''); 

  function handleLogout() {
    logout();
    history.push('/');
  } 

  useEffect(() => {
    buscarFazendas(); 
  }, []);
 
  async function buscarFazendas() {
    handleOpen();
    try {
      const getFazendas = await api.get('/fazendas', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setData(getFazendas.data);
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
      title: "Deseja excluir a fazenda?",
      icon: "warning", 
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deleteFazenda(id);
      }
    });
  }

  async function deleteFazenda(id) {  
    handleOpen();
    try {
      const callBackPost = await api.delete(`/fazendas/${id}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            buscarFazendas();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            buscarFazendas(); 
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
              titulo={'Fazendas'}
              msgSemDados={'Nenhuma fazenda cadastrada'}
              colunas={colunas} 
              data={data}
              add={{tooltip: 'Adicionar Fazenda', acao: handleFormCadastroChange}}
              editar={{tooltip: 'Editar Fazenda', acao: handleFormEditarChange, setId: setIdFazenda}}
              excluir={{tooltip: 'Excluir Fazenda', acao: handleDelete}}
            />
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        }
        {
          formCadastroOpen &&
          <AdicionarFazenda 
            formClose={handleFormCadastroChange} 
            handleLogout={handleLogout}
            buscarFazendas={buscarFazendas}
          />
        }
        {
          formEditarOpen &&
          <EditarFazenda 
            idFazenda={idFazenda}
            formClose={handleFormEditarChange}
            handleLogout={handleLogout}
            buscarFazendas={buscarFazendas} 
          />
        }
      </div>
    </>
  );
}