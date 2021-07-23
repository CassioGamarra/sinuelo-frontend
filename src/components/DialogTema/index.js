import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog'; 
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'; 
import Slide from '@material-ui/core/Slide';
import api from '../../services/api';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../utils/showToast';
import DialogContent from '@material-ui/core/DialogContent'; 
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';  
import DialogActions from '@material-ui/core/DialogActions';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#99ac8b'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogTema(props) {
  const classes = useStyles(); 
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  }; 
  const [descricao, setDescricao] = useState('');  

  const token = localStorage.getItem('TOKEN');

  async function handleRegister() { 
    let erros = semErros();

    if (erros.length > 0) {
      let msg = '';
      erros.map(elt => (
        msg += elt
      )
      );
      showMessage('error', msg);
    }
    else {
      const data = { 
        "descricao": descricao.trim(), 
      }; 

      handleOpen();
      try {
        const callBackPost = await api.post('/temas', data, {
          headers: {
            Authorization: "Bearer " + token, 
          }
        }); 
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              setDescricao('');
              props.handleDialogClose();
              props.buscarTemas();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              setDescricao('');
              props.handleDialogClose();
              props.buscarTemas();
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
              props.handleLogout();
            });
          }
        } else {
          handleClose();
          showMessage('error', 'Falha na conexão');
        }
      }
    }
  } 
 

  function semErros() {
    let erros = [];
    if (!descricao) {
      erros.push('Preencha a descrição!');
    }
    return erros;
  }

  return (
    <div>
      <Dialog  open={props.open} onClose={props.handleDialogClose} aria-labelledby="titulo-dialog">
        <DialogTitle id="titulo-dialog">Cadastrar Tema</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Você deve sugerir três combinações de data e hora para o contrante.
          </DialogContentText>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={12}>
              <TextField
                  id="descricao"
                  label="Descrição"
                  variant="outlined"
                  value={descricao}
                  required
                  onChange={e => setDescricao(e.target.value)}
                  style={{ marginBottom: '2em' }}
                  inputProps={{
                    maxLength: 500,
                  }}
                  fullWidth
                  size="small"
                />
            </Grid> 
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegister} class="btn-login">
            Salvar
          </Button>
          <Button onClick={props.handleDialogClose} class="btn-login">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}