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
 
import AdicionarDoenca from '../../../components/Forms/Doencas/Adicionar'; 
import EditarDoenca from '../../../components/Forms/Doencas/Editar';
  
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
    { title: 'Descrição', field: 'descricao', width: 250 }];

  const [data, setData] = useState([]);

  const [idDoenca, setIdDoenca] = useState(''); 

  function handleLogout() {
    logout();
    history.push('/');
  } 

  useEffect(() => {
    buscarDoencas(); 
  }, []);
 
  async function buscarDoencas() {
    handleOpen();
    try {
      const getDoencas = await api.get('/doencas', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setData(getDoencas.data);
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
      title: "Deseja excluir a doença?",
      icon: "warning", 
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        deletaDoenca(id);
      }
    });
  }

  async function deletaDoenca(id) {  
    handleOpen();
    try {
      const callBackPost = await api.delete(`/doencas/${id}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            buscarDoencas();
          });
        }
        if (callBackPost.data.deletado) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            buscarDoencas(); 
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
              titulo={'Doenças'}
              msgSemDados={'Nenhum doença cadastrada'}
              colunas={colunas} 
              data={data}
              add={{tooltip: 'Adicionar Doença', acao: handleFormCadastroChange}}
              editar={{tooltip: 'Editar Doença', acao: handleFormEditarChange, setId: setIdDoenca}}
              excluir={{tooltip: 'Excluir Doença', acao: handleDelete}}
            />
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        }
        {
          formCadastroOpen &&
          <AdicionarDoenca 
            formClose={handleFormCadastroChange} 
            handleLogout={handleLogout}
            buscarDoencas={buscarDoencas}
          />
        }
        {
          formEditarOpen &&
          <EditarDoenca 
            idDoenca={idDoenca}
            formClose={handleFormEditarChange}
            handleLogout={handleLogout}
            buscarDoencas={buscarDoencas} 
          />
        }
      </div>
    </>
  );
}