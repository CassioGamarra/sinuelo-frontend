import React, { useState, useEffect } from 'react'; 
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button'; 
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'; 
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';  
import Container from '@material-ui/core/Container';
import api from '../../../../services/api';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../utils/showToast'; 

import { cepMask } from '../../../../utils/mask';

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
 
export default function FormEditarFazenda(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  
  const [idFazenda, setIdFazenda] = useState('');
  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const token = localStorage.getItem('TOKEN');

  useEffect(() => {
    buscarFazenda();  
  }, []);
 
  async function handleEdit(e) {
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
        NOME: nome.trim(),
        CEP: cep.replace(/[^\d]+/g, ''),
        CIDADE: cidade.trim(),
        ESTADO: estado.trim() 
      };
      handleOpen();
      try {
        const callBackPost = await api.put(`/fazendas/${idFazenda}`, data, {
          headers: {
            Authorization: "Bearer " + token
          }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();   
              props.buscarFazendas();
              props.formClose();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos(); 
              props.buscarFazendas();
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

  async function buscarFazenda() {
    handleOpen();
    try {
      const getFazendaById = await api.get(`/fazendas/${props.idFazenda}`, {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      let dados = getFazendaById.data[0];
      setIdFazenda(dados.id);
      setNome(dados.nome);
      setCep(dados.cep);
      setCidade(dados.cidade);
      setEstado(dados.estado);
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

  //Verifica o campo de CEP para realizar a busca
  function verificaCep(cep) {
    if (cep.length === 9) {
      cep = cep.replace(/[^\d]+/g, '');
      if (cep.length === 8) {
        getCep(cep);
      }
    }
  }

  //Busca o cep no VIACEP
  async function getCep(cep) {
    handleOpen();
    let url = 'https://viacep.com.br/ws/' + cep + '/json/';
    const response = await fetch(url);
    const json = await response.json();
    handleClose();
    if (!json.erro) {
      setCidade(json.localidade);
      setEstado(json.uf);
    } else {
      setCidade('');
      setCidade('');
    } 
  } 

  function limparCampos() {
    setNome('');
    setCep('');
    setCidade('');
    setEstado('');
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
              EDITAR FAZENDA
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{backgroundColor: '#004725', marginTop: '1em'}}>
          <form onSubmit={handleEdit}>
            <Grid container spacing={2} alignItems="flex-end">
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
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                <TextField
                  id="cep"
                  label="CEP"
                  variant="filled"
                  value={cep}
                  required
                  fullWidth
                  required 
                  onChange={e => setCep(cepMask(e.target.value), verificaCep(e.target.value))} 
                  size="small" 
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6} >
                <TextField
                  id="cidade"
                  label="Cidade"
                  variant="filled"
                  value={cidade}
                  required 
                  onChange={e => setCidade(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3} >
                <TextField
                  id="estado"
                  label="Estado" 
                  variant="filled"
                  value={estado}
                  required 
                  onChange={e => setEstado(e.target.value)} 
                  inputProps={{
                    maxLength: 2,
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