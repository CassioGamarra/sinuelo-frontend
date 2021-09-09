import React, { useEffect, useState } from 'react';  
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
import api from '../../../services/api';
import { showMessage } from '../../../utils/showToast'; 
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import CustomMaterialTable from '../../../components/CustomMaterialTable';
 
import AdicionarRaca from '../../../components/Forms/Racas/Adicionar'; 
import EditarRaca from '../../../components/Forms/Racas/Editar';
  
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
    { title: 'Nome', field: 'nome', width: 20 }, 
    { title: 'Nº de animais', field: 'num_animais', width: 20 },
  ]; 

  const [data, setData] = useState([]);

  const [idRaca, setIdRaca] = useState('');

  function handleLogout() {
    logout();
    history.push('/');
  }

  useEffect(() => {
    buscarRacas();
  }, []);

  async function buscarRacas() {
    handleOpen();
    try {
      const getRacas = await api.get('/racas', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setData(getRacas.data);
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
      title: "Deseja excluir a raça?",
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
          (!formCadastroOpen && !formEditarOpen) &&
          <CustomMaterialTable
            titulo={'Raças'}
            msgSemDados={'Nenhuma raça cadastrada'}
            colunas={colunas} 
            data={data}
            add={{tooltip: 'Adicionar Raça', acao: handleFormCadastroChange}}
            editar={{ tooltip: 'Editar Fazenda', acao: handleFormEditarChange, setId: setIdRaca }}
            excluir={{tooltip: 'Excluir Raça', acao: handleDelete}}
          />
        }
        {
          formCadastroOpen &&
          <AdicionarRaca
            formClose={handleFormCadastroChange}
            handleLogout={handleLogout}
            buscarRacas={buscarRacas}
          />
        }
        {
          formEditarOpen &&
          <EditarRaca
            idRaca={idRaca}
            formClose={handleFormEditarChange}
            handleLogout={handleLogout}
            buscarRacas={buscarRacas}
          />
        }
      </div>
    </>
  );
}