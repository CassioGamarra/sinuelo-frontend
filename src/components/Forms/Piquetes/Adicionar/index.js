import React, { useState, useEffect } from 'react'; 
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'; 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid'; 
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl'; 
import Container from '@material-ui/core/Container';
import api from '../../../../services/api';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../utils/showToast'; 

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
    backgroundColor: '#FFFFFF',
    color: '#004725' 
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1000,
    color: '#fff',
  }, 
}));
 
export default function FormAdicionarPiquete(props) {
  const classes = useStyles(); 
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
 
  const [idFazenda, setIdFazenda] = useState('');
  const [fazenda, setFazenda] = useState('');
  const [nome, setNome] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [fazendas, setFazendas] = useState([]);

  const token = localStorage.getItem('TOKEN');

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
      setFazendas(getFazendas.data);
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
            props.handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  async function handleRegister(e) {
    e.preventDefault();

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
        ID_FAZENDA: idFazenda,
        NOME: nome.trim(),
        CAPACIDADE: capacidade, 
      }; 
      handleOpen();
      try {
        const callBackPost = await api.post('/piquetes', data, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose(); 
              props.formClose();
              props.buscarPiquetes();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose(); 
              props.formClose();
              props.buscarPiquetes();
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
    return erros;
  }

  return (
    <div style={{backgroundColor: '#004725', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar> 
            <Typography variant="h6" className={classes.title} >
              CADASTRAR PIQUETE
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{backgroundColor: '#004725', marginTop: '1em'}}>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12}>
                <FormControl className={classes.formControl} variant="filled" fullWidth required>
                  <Autocomplete
                    id="fazendas"
                    options={fazendas}
                    getOptionLabel={(option) => option.nome}
                    getOptionSelected={(option) => option.id}
                    onChange={(event, value) => { 
                      if (value) {
                        setIdFazenda(value.id);
                      }
                    }}
                    size="small"
                    inputValue={fazenda} //Valor que armazena no textField
                    onInputChange={(event, input) => {
                      setFazenda(input)
                    }}
                    required
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Selecionar Fazenda *"
                        variant="filled"
                      />
                    } 
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="nome"
                  label="Nome"
                  variant="filled"
                  value={nome}
                  required 
                  onChange={e => setNome(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"   
                />
              </Grid>  
              <Grid item xs={12}>
                <TextField
                  id="capacidade"
                  label="Capacidade" 
                  variant="filled"
                  value={capacidade}
                  required 
                  type="number"
                  onChange={e => setCapacidade(e.target.value)}  
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Button type="submit" className="btn-login btn-form">
                  Salvar
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button className="btn-login btn-form" onClick={props.formClose}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Container>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}