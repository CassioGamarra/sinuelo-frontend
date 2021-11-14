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
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl'; 
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import api from '../../../../services/api';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../utils/showToast'; 

import { dateMask } from '../../../../utils/mask';

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
 
export default function FormAdicionarAnimal(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [fazendas, setFazendas] = useState([]);
  const [piquetes, setPiquetes] = useState([]);
  const [racas, setRacas] = useState([]); 

  const [idAnimal, setIdAnimal] = useState('');
  const [idFazenda, setIdFazenda] = useState('');
  const [fazenda, setFazenda] = useState('');
  const [idPiquete, setIdPiquete] = useState('');
  const [piquete, setPiquete] = useState('');
  const [idRaca, setIdRaca] = useState('');
  const [raca, setRaca] = useState(''); 
  const [nome, setNome] = useState('');
  const [sexo, setSexo] = useState(''); 
  const [dataNascimento, setDataNascimento] = useState('');
  const [nomePai, setNomePai] = useState('');
  const [nomeMae, setNomeMae] = useState('');
  const [peso, setPeso] = useState('');
  const [pelagem, setPelagem] = useState('');

  const token = localStorage.getItem('TOKEN');

  useEffect(() => {
    buscarAnimal();
    buscarFazendas();  
    buscarRacas();
  }, []);

  async function buscarAnimal() {
    handleOpen();
    try {
      const getAnimalById = await api.get(`/animais/${props.idAnimal}`, {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      let dados = getAnimalById.data[0];  
      setIdAnimal(dados.id);
      setIdFazenda(dados.id_fazenda);
      setFazenda(dados.fazenda);
      if(dados.id_piquete) {
        await buscarPiquetes(dados.id_fazenda);
        setIdPiquete(dados.id_piquete);
        setPiquete(dados.piquete);
      }
      setIdRaca(dados.id_raca);
      setRaca(dados.raca);
      setNome(dados.nome);
      setSexo(dados.sexo);
      setDataNascimento(dados.dt_nascimento);
      setNomePai(dados.nome_pai);
      setNomeMae(dados.nome_mae);
      setPeso(dados.peso);
      setPelagem(dados.pelagem);
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

  async function buscarPiquetes(id) {
    handleOpen();
    try {
      const getPiquetes = await api.get(`/fazendas/${id}/piquetes`, {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setPiquetes(getPiquetes.data);
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

  async function buscarRacas() {
    handleOpen();
    try {
      const getRacas = await api.get('/racas', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setRacas(getRacas.data);
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
        ID_FAZENDA: idFazenda,
        ID_PIQUETE: idPiquete !== '' ? idPiquete : null,
        ID_RACA: idRaca,
        NOME: nome.trim(),
        SEXO: sexo,
        DATA_NASCIMENTO: dataNascimento,
        NOME_PAI: nomePai.trim(),
        NOME_MAE: nomeMae.trim(),
        PESO: peso,
        PELAGEM: pelagem.trim()
      }; 
      handleOpen();
      try {
        const callBackPost = await api.put(`/animais/${idAnimal}`, data, {
          headers: { Authorization: "Bearer " + token }
        });
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.formClose();
              props.buscarAnimais();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.formClose();
              props.buscarAnimais();
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
              CADASTRAR ANIMAL 
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth={false} style={{backgroundColor: '#004725', marginTop: '1em'}}>
          <form onSubmit={handleEdit}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} md={4} lg={4} xl={4} >
                <FormControl className={classes.formControl} variant="filled" fullWidth required>
                  <Autocomplete
                    id="fazendas"
                    options={fazendas}
                    getOptionLabel={(option) => option.nome}
                    getOptionSelected={(option) => option.id}
                    onChange={(event, value) => {
                      if (value) {
                        setIdFazenda(value.id);
                        buscarPiquetes(value.id);
                      }
                    }}
                    size="small"
                    inputValue={fazenda} //Valor que armazena no textField
                    onInputChange={(event, input) => {
                      setFazenda(input);
                    }}
                    required
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Selecionar Fazenda"
                        variant="filled"
                        required
                      />
                    } 
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} lg={4} xl={4} >
                <FormControl className={classes.formControl} variant="filled" fullWidth required>
                  <Autocomplete
                    id="piquetes"
                    options={piquetes}
                    getOptionLabel={(option) => option.nome}
                    getOptionSelected={(option) => option.id}
                    onChange={(event, value) => {
                      if (value) {
                        setIdPiquete(value.id);
                      } else {
                        setIdPiquete('');
                      }
                    }}
                    size="small"
                    inputValue={piquete} //Valor que armazena no textField
                    onInputChange={(event, input) => {
                      setPiquete(input)
                    }} 
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Selecionar Piquete"
                        variant="filled" 
                      />
                    } 
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4} lg={4} xl={4} >
                <FormControl className={classes.formControl} variant="filled" fullWidth required>
                  <Autocomplete
                    id="racas"
                    options={racas}
                    getOptionLabel={(option) => option.nome}
                    getOptionSelected={(option) => option.id}
                    onChange={(event, value) => {
                      if (value) {
                        setIdRaca(value.id);
                      }
                    }}
                    size="small"
                    inputValue={raca} //Valor que armazena no textField
                    onInputChange={(event, input) => {
                      setRaca(input)
                    }}
                    required
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Selecionar Raça"
                        variant="filled"
                        required
                      />
                    } 
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} >
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
              <Grid item xs={12} md={6} lg={6} xl={6} >
                <FormControl className={classes.formControl} variant="filled" required fullWidth size="small" >
                  <InputLabel id="sexo-label">Sexo</InputLabel>
                  <Select
                    labelId="sexo-label"
                    id="sexo"
                    value={sexo} 
                    onChange={e => setSexo(e.target.value)}
                    required
                  > 
                    <MenuItem value={'M'}>Macho</MenuItem>
                    <MenuItem value={'F'}>Fêmea</MenuItem>
                  </Select>
                </FormControl>
              </Grid> 
              <Grid item xs={12} md={6} lg={6} xl={6} >
                <TextField
                  id="data-nascimento"
                  label="Data de Nascimento"
                  variant="filled"
                  value={dataNascimento}
                  required 
                  onChange={e => setDataNascimento(dateMask(e.target.value))}  
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6} >
                <TextField
                  id="nome-pai"
                  label="Nome do Pai"
                  variant="filled"
                  value={nomePai}
                  required 
                  onChange={e => setNomePai(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6} >
                <TextField
                  id="nome-mae"
                  label="Nome da Mãe"
                  variant="filled"
                  value={nomeMae}
                  required 
                  onChange={e => setNomeMae(e.target.value)} 
                  inputProps={{
                    maxLength: 200,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid> 
              <Grid item xs={12} md={6} lg={6} xl={6} >
                <TextField
                  id="peso"
                  label="Peso"
                  variant="filled"
                  value={peso}
                  required 
                  type="number"
                  onChange={e => setPeso(e.target.value)} 
                  inputProps={{
                    max: 5000,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6} >
                <TextField
                  id="pelagem"
                  label="Pelagem"
                  variant="filled"
                  value={pelagem}
                  required 
                  onChange={e => setPelagem(e.target.value)} 
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