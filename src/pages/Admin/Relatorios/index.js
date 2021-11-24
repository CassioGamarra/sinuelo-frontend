import React, { useState } from 'react';  
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import { showMessage } from '../../../utils/showToast'; 
import CustomMaterialTableReports from '../../../components/CustomMaterialTableReports';
import FormControl from '@material-ui/core/FormControl'; 
import Autocomplete from '@material-ui/lab/Autocomplete';  
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';   
import Button from '@material-ui/core/Button'; 
import Typography from '@material-ui/core/Typography'; 
import api from '../../../services/api';

//Loader Material UI
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

 
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  panels: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper, 
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  }, 
  title: {
    fontSize: theme.typography.pxToRem(32),
    fontWeight: 500, 
    color: '#004725',
    padding: '0.5em',
    fontFamily: 'Bebas Neue'
  },
  formControl: {
    padding: '1em',
    marginTop: '1em',
    maxWidth: 450
  }
}));

export default function Home() {
  const history = useHistory();
  const classes = useStyles();  
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [idRelatorio, setIdRelatorio] = useState('');
  const [relatorio, setRelatorio] = useState('');
  const [dadosRelatorio, setDadosRelatorio] = useState([]);
  const [colunas, setColunas] = useState([]);

  const token = localStorage.getItem('TOKEN');

  const relatorios = [
    {id: 1, descricao: 'Histórico de Pesagem'},
    {id: 2, descricao: 'Histórico de Vacinas'},
    {id: 3, descricao: 'Histórico de Doenças'},
    {id: 4, descricao: 'Histórico de Medicamentos'}
  ]  

  function handleLogout() {
    logout();
    history.push('/');
  }  
 
  async function buscarRelatorio() {
    if(idRelatorio === '') {
      showMessage('alert', 'Selecione um relatório');
    } else {
      handleOpen();
      try {
        const getDados = await api.get(`/relatorios/${idRelatorio}`, {
          headers: { Authorization: "Bearer " + token }
        });
        handleClose(); 
        setDadosRelatorio(getDados.data.dados);
        setColunas(getDados.data.colunas); 
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
  }

  return (
    <>
      <Header
        logout={handleLogout}
      />
      <ToastAnimated />
      <div className={classes.panels} >
        <Container maxWidth={false}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3} >
              <FormControl className={classes.formControl} variant="outlined" fullWidth>
                <Autocomplete
                  id="animais"
                  options={relatorios}
                  getOptionLabel={(option) => option.descricao}
                  getOptionSelected={(option) => option.id}
                  onChange={(event, value) => {
                    if (value) {
                      setIdRelatorio(value.id);
                    } else {
                      setIdRelatorio('');
                    }
                  }}
                  inputValue={relatorio} //Valor que armazena no textField
                  onInputChange={(event, input) => {
                    setRelatorio(input);
                  }}
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Selecionar Relatório"
                      variant="outlined"
                    />
                  }
                />
              </FormControl> 
            </Grid>
            <Grid item xs={2} style={{marginTop: '1em'}}>
              <Button className="btn-login" style={{maxWidth: 200}} onClick={buscarRelatorio}>
                Carregar
              </Button>
            </Grid>
            <Grid item xs={2} style={{marginTop: '1em'}}>
              <Button className="btn-login" style={{maxWidth: 200}} onClick={() => setDadosRelatorio([])}>
                Limpar resultados
              </Button>
            </Grid>
          </Grid>
        </Container>
        {
          dadosRelatorio.length > 0 &&
          <CustomMaterialTableReports
            titulo={relatorio}
            msgSemDados={'Nenhum dado encontrado'}
            colunas={colunas}
            data={dadosRelatorio}
          />
        }
        {
          dadosRelatorio.length === 0 && 
          <Container maxWidth={false} style={{marginTop: '5em'}}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} >
              <Typography className="textInit" style={{ marginTop: "10px" }}>
                Nenhum dado encontrado
              </Typography>
            </Grid>
          </Grid>
        </Container>
        }
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    </>
  );
}