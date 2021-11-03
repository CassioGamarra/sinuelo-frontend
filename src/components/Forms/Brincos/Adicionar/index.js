import React, { useState, useEffect } from 'react'; 
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'; 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';  
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl'; 
import Autocomplete from '@material-ui/lab/Autocomplete'; 
import Switch from '@material-ui/core/Switch';
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

export default function FormAdicionarBrinco(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  
  const [codRfid, setCodRfid] = useState('');
  const [codVisual, setCodVisual] = useState('');
  const [idAnimal, setIdAnimal] = useState(''); 
  const [animal, setAnimal] = useState('');
  const [animais, setAnimais] = useState('');

  const token = localStorage.getItem('TOKEN');

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
      setAnimais(getAnimais.data);
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
        ID_ANIMAL: idAnimal,
        COD_RFID: codRfid.trim(),
        COD_VISUAL: codVisual.trim()
      };
      handleOpen();
      try {
        const callBackPost = await api.post('/brincos', data, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();   
              props.buscarBrincos();
              props.formClose();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos(); 
              props.buscarBrincos();
              props.formClose();
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

  function limparCampos() {
    setIdAnimal('');
    setCodRfid('');
    setCodVisual(''); 
  }

  function semErros() {
    let erros = [];
    if (codRfid === '' && codVisual === '') {
      erros.push('Por favor, preencha pelo um dos códigos!');
    } 
    if (codRfid !== '' && codVisual !== '') {
      erros.push('Por favor, preencha apenas um dos códigos!');
    }
    return erros;
  }

  return (
    <div style={{backgroundColor: '#004725', height: 'calc(100vh - 64px)' }}>
      <Container disableGutters maxWidth={false} >
        <AppBar className={classes.appBar} elevation={0}>
          <Toolbar> 
            <Typography variant="h6" className={classes.title} >
              CADASTRAR BRINCO
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{backgroundColor: '#004725', marginTop: '1em'}}>
          <form onSubmit={handleRegister}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} >
                <FormControl className={classes.formControl} variant="filled" fullWidth>
                  <Autocomplete
                    id="animais"
                    options={animais}
                    getOptionLabel={(option) => option.nome}
                    getOptionSelected={(option) => option.id}
                    onChange={(event, value) => {
                      if (value) {
                        setIdAnimal(value.id); 
                      }
                    }}
                    size="small"
                    inputValue={animal} //Valor que armazena no textField
                    onInputChange={(event, input) => {
                      setAnimal(input);
                    }} 
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Selecionar Animal"
                        variant="filled" 
                      />
                    } 
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="codigoRfid"
                  label="Código RFID"
                  variant="filled"
                  value={codRfid} 
                  onChange={e => setCodRfid(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"   
                />
              </Grid> 
              <Grid item xs={12}>
                <TextField
                  id="codigoVisual"
                  label="Código Visual"
                  variant="filled"
                  value={codVisual} 
                  onChange={e => setCodVisual(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
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