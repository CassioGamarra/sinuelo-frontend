import './styles.css';
import React, { useState, lazy } from 'react';
import { Link, useHistory } from 'react-router-dom';
//Componentes
import ToastAnimated from '../../components/Toasts';
import { showMessage, showWarning, showError } from '../../utils/showToast';
//Validadores
import { validarDados } from '../../utils/validators';
//Services
import api from '../../services/api';
import { login, loginTipo } from '../../services/auth';
//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress'; 
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography'; 
import { makeStyles } from '@material-ui/core/styles';
//Logos
import logo from '../../assets/logo.png';
import Copyright from '../../components/Copyright/index';
 
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  root: {
    height: '100vh',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
//Login 
export default function Login() {
  //Loader
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  //Login com CNPJ e Senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory(); 

  async function handleLogin(e) {
    e.preventDefault();//previne de atualizar a página

    const data = {
      "email": email,
      "senha": password,
    };
    if (!validarDados(data)) {
      showMessage('warn', 'Preencha todos os campos!');
    }
    else {
      handleOpen();
      try {
          const callBackPost = await api.post('/login', data);
          if (callBackPost) {
              if (callBackPost.data.statusCode === 200) {
                  handleClose();
                  login(callBackPost.data.token);
                  loginTipo(callBackPost.data.tipo);
                  if (callBackPost.data.message) {
                      localStorage.setItem("msg", callBackPost.data.message);
                  }
                  console.log('logou!')
                  history.push('/admin/home');
              }
              if (callBackPost.data.statusCode === 404) {
                  handleClose();
                  showWarning(callBackPost);
              }
              if (callBackPost.data.statusCode === 403) {
                  handleClose();
                  showError(callBackPost);
              }
          }
      } catch (err) { 
          handleClose();
          showMessage('error', 'Falha ao acessar, tente novamente mais tarde');
      }
    }
  }
  return (
    <> 
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <div className="backgroundImage"></div>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <img src={logo} alt="Sul Services" style={{ maxWidth: '100%', marginBottom: '1em', width: '40ch' }} />
            <Grid container style={{ marginTop: "5%" }}>
              <Grid item xs={12} >
                <Typography class="textInit" style={{ marginTop: "10px" }}>
                  Portal do Administrador
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: '1em' }}>
              <form onSubmit={handleLogin} className={classes.form}>
                <Grid container spacing={1} alignItems="flex-end">
                  <TextField
                    id="email"
                    label="E-mail"
                    variant="outlined"
                    value={email}
                    required
                    onChange={e => setEmail(e.target.value)}
                    style={{ marginBottom: '1em' }}
                    inputProps={{
                      maxLength: 100,
                    }}
                    type="email"
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid container spacing={1} alignItems="flex-end">
                  <TextField
                    id="password"
                    label="Senha"
                    variant="outlined"
                    type="password"
                    value={password}
                    required
                    fullWidth
                    onChange={e => setPassword(e.target.value)}
                    inputProps={{
                      maxLength: 200,
                    }}
                    size="small"
                  />
                </Grid>
                <Grid container spacing={1} style={{ marginTop: '2%' }}>
                  <Grid item xs={12}>
                    <Button type="submit" class="btn-login">
                      Entrar
                    </Button>
                  </Grid> 
                </Grid> 
              </form>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </div>
        </Grid>
      </Grid>
      <ToastAnimated />
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

