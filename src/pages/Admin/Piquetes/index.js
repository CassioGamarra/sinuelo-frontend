import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts';
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
import api from '../../../services/api';
import { showMessage } from '../../../utils/showToast'; 
//Loader Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import CustomMaterialTable from '../../../components/CustomMaterialTable';

import AdicionarPiquete from '../../../components/Forms/Piquetes/Adicionar';
import EditarPiquete from '../../../components/Forms/Piquetes/Editar';

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
    { title: 'Piquete', field: 'piquete', width: 20 },
    { title: 'Fazenda', field: 'fazenda', width: 250 },
    { title: 'Capacidade', field: 'capacidade', width: 20 },
    { title: 'Nº de animais', field: 'num_animais', width: 20 },
  ];
 
  const [data, setData] = useState([]);

  const [idPiquete, setIdPiquete] = useState('');

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    buscarPiquetes();
  }, []);

  async function buscarPiquetes() {
    handleOpen();
    try {
      const getPiquetes = await api.get('/piquetes', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setData(getPiquetes.data);
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
        console.log('Excluir: ' + id)
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
          (!formCadastroOpen && !formEditarOpen) &&
          <>
            <CustomMaterialTable
              titulo={'Piquetes'}
              msgSemDados={'Nenhum piquete cadastrado'}
              colunas={colunas}
              data={data}
              add={{ tooltip: 'Adicionar Piquete', acao: handleFormCadastroChange }}
              editar={{ tooltip: 'Editar Piquete', acao: handleFormEditarChange, setId: setIdPiquete }}
              excluir={{ tooltip: 'Excluir Piquete', acao: handleDelete }}
            />
            <Backdrop className={classes.backdrop} open={open}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </>
        }
        {
          formCadastroOpen &&
          <AdicionarPiquete
            formClose={handleFormCadastroChange}
            handleLogout={handleLogout}
            buscarPiquetes={buscarPiquetes}
          />
        }
        {
          formEditarOpen &&
          <EditarPiquete
            idPiquete={idPiquete}
            formClose={handleFormEditarChange}
            handleLogout={handleLogout}
            buscarPiquetes={buscarPiquetes}
          />
        }
      </div>
    </>
  ); 
}