import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import './styles.css';
import api from '../../../../services/api';
import { useHistory, Link } from 'react-router-dom';
import { logout } from '../../../../services/auth.js';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../../../utils/showToast';
 
//Backdrop 
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Swal from 'sweetalert2';
//Tab panels
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
//Button group
import ButtonGroup from '@material-ui/core/ButtonGroup';
//Card 
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
//Busca dinâmica
import Autocomplete from '@material-ui/lab/Autocomplete';
/*Icones*/
import AddCircleIcon from '@material-ui/icons/AddCircle'; 
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';  

//Inicio tab panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}
//Fim tabe panels

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  root: {
    maxWidth: '100%',
    display: 'block',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  btn: {
    width: '12em',
    height: '3em',
    backgroundColor: '#021931',
    boxShadow: '0 0 3px 0 rgba(0, 0, 0, .5)',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
    color: '#fff',
    "&:hover": {
      filter: 'brightness(90%)',
      backgroundColor: '#021931',
    }
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: '100%',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    border: 'solid',
    borderColor: '#021931',
    borderWidth: 'thin'
  },
  wppContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    boxSizing: 'border-box'
  },
  wppIcon: {
    color: 'green',
    margin: '-4px 0 0 4px'
  }
}));

export default function ListaServicos() {
  const history = useHistory();
  const classes = useStyles();
  //Token
  const token = localStorage.getItem('TOKEN');
  //Loader
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  //Tab panels
  const [value, setValue] = useState(0);
  const handleChangePanel = (event, newValue) => {
    setValue(newValue);
  };
  //Ação
  const [action, setAction] = useState('none');
  //Opções de atividade 
  const [openNewCategory, setOpenNewCategory] = useState(false);
  const [openNewService, setOpenNewService] = useState(false);
  //Accordion
  const [expanded, setExpanded] = useState(false);

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  //Campos 
  const [descricaoCategoria, setDescricaoCategoria] = useState('');
  const [descricaoServico, setDescricaoServico] = useState('');

  const [idCategoria, setIdCategoria] = useState('');
  const [categoria, setCategoria] = useState('');
  //Listas
  const [categorias, setCategorias] = useState([]);
  const [servicos, setServicos] = useState([]);
   
  const handleOpenNewCategory= () => {
    setOpenNewCategory(!openNewCategory);
    if(openNewService) {
      setOpenNewService(!openNewService); 
    }  
  }; 

  const handleOpenNewService = () => {
    if(categorias.length === 0) {
      showMessage('error', 'Nenhuma categoria cadastrada!');
    } else { 
      setOpenNewService(!openNewService);    
      if(openNewCategory){
        setOpenNewCategory(!openNewCategory);  
      }
    }
  }; 

  useEffect(() => {
    buscarCategorias();
    buscarTiposServicos();
  }, []); 

  async function buscarCategorias() {
    handleOpen();
    try {
      const getCategorias = await api.get('/categorias/listar', {
        headers: { Authorization: "Bearer " + token }
      });
      
      handleClose();
      setCategorias(getCategorias.data); 
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

  async function buscarTiposServicos() {
    handleOpen();
    try {
      const getTiposServicos = await api.get('/admin/servicos/listar', {
        headers: { Authorization: "Bearer " + token }
      });
      handleClose();
      setServicos(getTiposServicos.data); 
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
 
  async function handleRegisterCategoria(e) {
    e.preventDefault();

    const data = {
      "descricao": descricaoCategoria.trim()
    };
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
      handleOpen();
      try {
        const callBackPost = await api.post('/admin/categorias/cadastrar', data, {
          headers: { Authorization: "Bearer " + token }
        });

        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose(); 
              limparCampos();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose(); 
              buscarCategorias();
              limparCampos();
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
              handleLogout();
            });
          }
        } else {
          handleClose();
          showMessage('error', 'Falha na conexão');
        }
      } 
    }
  }

  async function handleRegisterServico(e) {
    e.preventDefault();

    const data = {
      "descricao": descricaoServico.trim(),
      "id_categoria": idCategoria
    };

    let erros = semErros();

    if (!categoria) {
      showMessage('error', 'Selecione uma categoria!');
    }
    else if (erros.length > 0) {
      let msg = '';
      erros.map(elt => (
        msg += elt
      )
      );
      showMessage('error', msg);
    }
    else {
      handleOpen();
      try {
        const callBackPost = await api.post('/admin/servicos/cadastrar', data, {
          headers: { Authorization: "Bearer " + token }
        });

        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();  
              limparCampos();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose(); 
              buscarTiposServicos();
              limparCampos();
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
              handleLogout();
            });
          }
        } else {
          handleClose();
          showMessage('error', 'Falha na conexão');
        }
      }
    }
  }

  async function handleEditar(elt, tipo) {
    const { value: descricao } = await Swal.fire({
      title: "Insira o nome d"+(tipo === 'servico' ? 'o serviço': 'a categoria'),
      input: 'textarea', 
      inputPlaceholder: 'Nome do serviço...',
      inputValue: tipo === 'servico'? elt.SERVICO : elt.DESCRICAO,
      showCancelButton: true,
      confirmButtonText: 'Salvar',
      cancelButtonText: 'Cancelar' 
    })
    
    if (descricao) { 
      elt.DESCRICAO = descricao;
      if(tipo === 'servico') {
        editarServico(elt);
      } else {
        editarCategoria(elt);
      }
    }
  }

  async function editarServico(elt) {
    const data = {
      id_tipo_servico: elt.ID_TIPO_SERVICO,
      descricao: elt.DESCRICAO
    };
    handleOpen();
    try {
      const callback = await api.post('/admin/servico/editar', data, {
        headers: { Authorization: "Bearer " + token }
      });
      if (callback.data.success) {
        swal({
          title: callback.data.title,
          text: callback.data.message,
          icon: "success",
          buttons: "OK"
        });
        handleClose();
        buscarTiposServicos();
      } else if (callback.data.error) {
        swal({
          title: callback.data.title,
          text: callback.data.message,
          icon: "error",
          buttons: "OK"
        });
        handleClose();
        buscarTiposServicos();
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  async function editarCategoria(elt) {
    const data = {
      id_categoria: elt.ID_CATEGORIA,
      descricao: elt.DESCRICAO
    };
    handleOpen();
    try {
      const callback = await api.post('/admin/categoria/editar', data, {
        headers: { Authorization: "Bearer " + token }
      });
      if (callback.data.success) {
        swal({
          title: callback.data.title,
          text: callback.data.message,
          icon: "success",
          buttons: "OK"
        });
        handleClose();
        buscarCategorias();
      } else if (callback.data.error) {
        swal({
          title: callback.data.title,
          text: callback.data.message,
          icon: "error",
          buttons: "OK"
        });
        handleClose();
        buscarCategorias();
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }
 
  async function handleExcluir(id, tipo) {
    swal({
      title: "Deseja excluir "+(tipo === 'servico' ? 'o serviço': 'a categoria')+"?",
      icon: "warning",
      icon: "warning",
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        if(tipo === 'servico') {
          excluirServico(id);
        } else {
          excluirCategoria(id);
        } 
      }
    });
  }

  async function excluirServico(id) {
    const data = {
      id_tipo_servico: id
    };
    handleOpen();
    try {
      const callback = await api.post('/admin/servico/excluir', data, {
        headers: { Authorization: "Bearer " + token }
      });
      if (callback.data.success) {
        swal({
          title: callback.data.title,
          text: callback.data.message,
          icon: "success",
          buttons: "OK"
        });
        handleClose();
        buscarTiposServicos();
      } else if (callback.data.error) {
        swal({
          title: callback.data.title,
          text: callback.data.message,
          icon: "error",
          buttons: "OK"
        });
        handleClose();
        buscarTiposServicos();
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  }

  async function excluirCategoria(id) {
    const data = {
      id_categoria: id
    };
    handleOpen();
    try {
      const callback = await api.post('/admin/categoria/excluir', data, {
        headers: { Authorization: "Bearer " + token }
      });
      if (callback.data.success) {
        swal({
          title: callback.data.title,
          text: callback.data.message,
          icon: "success",
          buttons: "OK"
        });
        handleClose();
        buscarCategorias();
      } else if (callback.data.error) {
        swal({
          title: callback.data.title,
          text: callback.data.message,
          icon: "error",
          buttons: "OK"
        });
        handleClose();
        buscarCategorias();
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
            handleLogout();
          });
        }
      } else {
        handleClose();
        showMessage('error', 'Falha na conexão');
      }
    }
  } 

  function limparCampos() { 
    if(openNewCategory){
      setOpenNewCategory(!openNewCategory);  
    }
    if(openNewService){
      setOpenNewService(!openNewService);  
    }
    setIdCategoria(''); 
    setDescricaoCategoria('');
    setDescricaoServico(''); 
    setCategoria('');
  }

  function handleLogout() {
    logout();
    history.push('/');
  }

  //Valida os dados inseridos
  function semErros() {
    let erros = [];
    if (descricaoCategoria || descricaoServico) {
      if (descricaoCategoria.length > 200 || descricaoServico.length > 200) {
        erros.push('Descrição não pode conter mais de 200 caracteres.');
      }
    }
    return erros;
  }

  return (
    <>
      <div className={classes.root}>
        <Button className={classes.btn} onClick={handleOpenNewCategory}>
          <AddCircleIcon /> Nova Categoria
        </Button>
        <Button className={classes.btn} onClick={handleOpenNewService}>
          <AddCircleIcon /> Novo Serviço
        </Button> 
        {
          (openNewCategory) &&
          <form onSubmit={handleRegisterCategoria} >
            <Card className={classes.layout}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <TextField 
                      label="Descrição" 
                      fullWidth 
                      defaultValue=""
                      variant="outlined"
                      required
                      onChange={e => setDescricaoCategoria(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button className={classes.btn} type="submit">
                  <SaveIcon /> Salvar
                </Button>
                <Button className={classes.btn} onClick={() => limparCampos()} >
                  <CancelIcon /> Cancelar
                </Button>
              </CardActions>
            </Card>
          </form>
        }
        {
          (openNewService) &&
          <form onSubmit={handleRegisterServico} >
            <Card className={classes.layout}>
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={12}>
                    <TextField 
                      label="Descrição" 
                      fullWidth 
                      defaultValue=""
                      variant="outlined"
                      required
                      onChange={e => setDescricaoServico(e.target.value)}
                    />
                  </Grid> 
                  <Grid item xs={12} sm={12}>
                    <FormControl className={classes.formControl} variant="outlined" fullWidth required>
                      <Autocomplete
                        id="categorias"
                        options={categorias}
                        getOptionLabel={(option) => option.DESCRICAO}
                        onChange={(event, value) => {
                          if (value) {
                            setIdCategoria(value.ID_CATEGORIA); 
                          }
                        }}
                        inputValue={categoria} //Valor que armazena no textField
                        onInputChange={(event, input) => {
                          setCategoria(input)
                        }}
                        renderInput={(params) =>
                          <TextField
                            {...params}
                            label="Selecionar Categoria *"
                            variant="outlined"
                          />
                        }
                      />
                    </FormControl>
                  </Grid> 
                </Grid>
              </CardContent>
              <CardActions>
                <Button className={classes.btn} type="submit">
                  <SaveIcon /> Salvar
                </Button>
                <Button className={classes.btn} onClick={() => limparCampos()} >
                  <CancelIcon /> Cancelar
                </Button>
              </CardActions>
            </Card>
          </form>
        }
        <Card className={classes.root}>
          <AppBar position="static" style={{ color: '#fff', backgroundColor: '#021931', fontWeight: 700 }} elevation={0}>
            <Tabs
              value={value}
              onChange={handleChangePanel}
              aria-label="tabs"
              variant="scrollable"
              scrollButtons="auto"
              indicatorColor="primary"
            >
              <Tab label="Serviços" {...a11yProps(0)} />
              <Tab label="Categorias" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {
              servicos.length === 0 &&
              <Typography variant="h6">Nenhum serviço cadastrado</Typography>
            }
            {
              servicos.length > 0 &&
              servicos.map((elt, index) => (
                <Card className={classes.root} key={index} style={{ marginBottom: '1em' }}>
                  <CardHeader
                    title={<div>{elt.SERVICO}</div>} 
                    style={{ marginBottom: '-2em' }}
                  />
                  <CardContent> 
                    <Typography variant="subtitle1">{elt.CATEGORIA}</Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12} style={{ marginBottom: '1em' }}>
                        <ButtonGroup size="small" aria-label="small outlined button group" style={{ margin: '-4px 0 0 0' }}>
                          <Button onClick={() => handleEditar(elt, 'servico')}> Editar</Button>
                          <Button onClick={() => handleExcluir(elt.ID_TIPO_SERVICO, 'servico')}> Excluir</Button>
                        </ButtonGroup>
                      </Grid> 
                    </Grid>
                  </CardActions>
                </Card>
              ))
            } 
          </TabPanel>
          <TabPanel value={value} index={1}>
            {
              categorias.length === 0 &&
              <Typography variant="h6">Você não possui nenhuma categoria cadastrada</Typography>
            }
            {
              categorias.length > 0 &&
              categorias.map((elt, index) => (
                <Card className={classes.root} key={index} style={{ marginBottom: '1em' }}>
                  <CardHeader
                    title={elt.DESCRICAO} 
                  /> 
                  <CardActions disableSpacing>
                    <Grid container spacing={1}>
                      <Grid item xs={12} sm={12} style={{ marginBottom: '1em' }}>
                        <ButtonGroup size="small" aria-label="small outlined button group" style={{ margin: '-4px 0 0 0' }}>
                          <Button onClick={() => handleEditar(elt)}> Editar</Button>
                          <Button onClick={() => handleExcluir(elt.ID_CATEGORIA)}> Excluir</Button>
                        </ButtonGroup>
                      </Grid> 
                    </Grid>
                  </CardActions>
                </Card>
              ))
            } 
          </TabPanel>
        </Card>
      </div>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}