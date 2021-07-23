import './styles.css';

import React, { useState, useEffect } from 'react';
import MaterialTable from '../../../../components/MaterialTableTemas';

import { useHistory } from 'react-router-dom';
import { showMessage } from '../../../../utils/showToast';
import { logout } from '../../../../services/auth';
import api from '../../../../services/api';
//Material table
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function Temas() {
  const history = useHistory();
  const token = localStorage.getItem('TOKEN');
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  const col = [
    { title: 'id', field: 'id_tema', hidden: true },
    { title: 'Tema', field: 'descricao'}];
  const [data, setData] = useState([]); 

  useEffect(() => { 
    buscarTemas();
  }, []); 

  async function buscarTemas() {
    handleOpen();
    try {
      const getTemas = await api.get('/temas', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setData(getTemas.data);
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

  function handleLogout() {
    logout();
    history.push('/');
  }

  return (
    <>
      <MaterialTable
        colunas={col}
        data={data}
        handleLogout={handleLogout}
        buscarTemas={buscarTemas} 
        acao={'Ações'} 
      />
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

