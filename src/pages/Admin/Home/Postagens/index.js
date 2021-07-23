import './styles.css';

import React, { useState, useEffect } from 'react';
import MaterialTable from '../../../../components/MaterialTablePostagens';

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

export default function Postagens() {
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
    { title: 'id', field: 'id_postagem', hidden: true },
    { title: 'Tema', field: 'tema', width: 20 },
    { title: 'Titulo', field: 'titulo', width: 250 },
    { title: 'Postado em', field: 'hora_postagem', width: 20 },];
  const [data, setData] = useState([]);
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    buscarPosts();
    buscarTemas();
  }, []);

  async function buscarPosts() {
    handleOpen();
    try {
      const getPosts = await api.get('/postagem/allweb', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setData(getPosts.data);
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

  async function buscarTemas() {
    handleOpen();
    try {
      const getTemas = await api.get('/temas', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setTemas(getTemas.data);
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
        buscarPosts={buscarPosts}
        acao={'Ações'}
        temas={temas}
      />
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

