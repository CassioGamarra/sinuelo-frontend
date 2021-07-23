import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Container from '@material-ui/core/Container';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControl from '@material-ui/core/FormControl';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import api from '../../services/api';
import swal from 'sweetalert';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../utils/showToast';
import FormData from 'form-data';

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
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogPost(props) {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [idTema, setIdTema] = useState('');
  const [descricaoTema, setDescricaoTema] = useState('');
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [imagem, setImagem] = useState(); 
  const [nomeImagem, setNomeImagem] = useState();

  const token = localStorage.getItem('TOKEN');
  
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
      /*const data = {
        "idTema": 1,
        "titulo": titulo.trim(),
        "texto": texto.trim(),
        "imagem": imagem
      };*/

      const data = new FormData();
      data.append('idTema', idTema);
      data.append('titulo', titulo.trim());
      data.append('texto', texto.trim());
      data.append('imagem', imagem);
 
      handleOpen();
      try {
        const callBackPost = await api.post('/postagem', data, {
          headers: { 
            Authorization: "Bearer " + token,
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`  
          }
        }); 
        if (callBackPost) {
          if (callBackPost.data.error) {
            swalRegisterError(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.handleDialogClose();
              props.buscarPosts();
            });
          }
          if (callBackPost.data.cadastrado) {
            swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
              handleClose();
              limparCampos();
              props.handleDialogClose();
              props.buscarPosts();
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
  
  const onFileChange = e => { 
    /*const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });*/
    if(e && e.target.files[0]) {
      handleOpen();
      setNomeImagem(e.target.files[0].name);
      setImagem(e.target.files[0]);
      handleClose();
      /*toBase64(e.target.files[0]).then(result => {
        setImagem(result.split(',')[1]);
        handleClose();
      });*/
    } else {
      setNomeImagem('');
    }
  }
  
  function limparCampos() {
    setIdTema('');
    setTitulo('');
    setNomeImagem('');
    setImagem('');
    setTexto('');
  }

  function semErros() {
    let erros = [];
    if (!idTema) {
      erros.push('Selecione o tema!');
    } 
    return erros;
  }

  return (
    <div>
      <Dialog fullScreen open={props.open} onClose={props.handleDialogClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={props.handleDialogClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Nova postagem
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl">
          <Grid container spacing={2} style={{ marginTop: '2em' }}>
            <form onSubmit={handleRegister} style={{ width: '100%' }}>
              <Grid container spacing={1} alignItems="flex-end">
                <FormControl className={classes.formControl} variant="outlined" fullWidth required>
                  <Autocomplete
                    id="temas"
                    options={props.temas}
                    getOptionLabel={(option) => option.descricao}
                    onChange={(event, value) => {
                      if (value) {
                        setIdTema(value.id_tema);
                      }
                    }}
                    size="small"
                    inputValue={descricaoTema} //Valor que armazena no textField
                    onInputChange={(event, input) => {
                      setDescricaoTema(input)
                    }}
                    required
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="Selecionar tema *"
                        variant="outlined"
                      />
                    }
                    style={{ marginBottom: '2em' }}
                  />
                </FormControl>
              </Grid>
              <Grid container spacing={1} alignItems="flex-end">
                <TextField
                  id="titulo"
                  label="Título"
                  variant="outlined"
                  value={titulo}
                  required
                  onChange={e => setTitulo(e.target.value)}
                  style={{ marginBottom: '2em' }}
                  inputProps={{
                    maxLength: 500,
                  }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid container spacing={1} alignItems="flex-end">
                <TextField
                  id="texto"
                  label="Texto"
                  variant="outlined"
                  value={texto}
                  required
                  multiline
                  rows={30}
                  fullWidth
                  onChange={e => setTexto(e.target.value)}
                  inputProps={{
                    maxLength: 8000,
                  }}
                  size="small"
                  style={{ marginBottom: '2em' }}
                />
              </Grid>
              <Grid container spacing={1} alignItems="flex-end">
                <Grid item xs={12}>
                  <input style={{ display: 'none' }} onChange={onFileChange} accept="image/*" id="icon-button-file" type="file" />
                  <label htmlFor="icon-button-file">
                    <Button class="btn-login" aria-label="upload picture" component="span" style={{ marginBottom: '1em' }}>
                      Selecionar imagem  <PhotoCamera />
                    </Button>
                    {
                      nomeImagem &&
                      <Chip
                        icon={<DoneIcon />}
                        label={nomeImagem}
                      />
                    }
                  </label>
                </Grid>
              </Grid>
              <Grid container spacing={1} style={{ marginTop: '2%' }}>
                <Grid item xs={12}>
                  <Button type="submit" class="btn-login">
                    Salvar
                  </Button> 
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Container>
      </Dialog>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}