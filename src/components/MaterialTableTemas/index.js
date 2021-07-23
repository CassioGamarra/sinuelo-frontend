import './styles.css';
import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import { showMessage, swalRegisterError, swalRegisterSuccess } from '../../utils/showToast';
import swal from 'sweetalert';
import api from '../../services/api';

import { Link, useHistory } from 'react-router-dom';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import DialogTema from '../DialogTema/index';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));
 
export default function MaterialTableTemas(props) {
  const history = useHistory();
  //Loader
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(!open);
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  }
  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
  } 
  const token = localStorage.getItem('TOKEN');

  async function handleEdit(id) {
    swal({
      title: "Deseja editar o tema?",
      icon: "warning", 
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((editar) => {
      if (editar) {
         
      }
    });
  }  

  async function handleDelete(id) {
    swal({
      title: "Deseja excluir o tema?",
      icon: "warning", 
      buttons: {
        confirm: "Sim",
        cancel: "Não"
      }
    }).then((excluir) => {
      if (excluir) {
        excluirTema(id);
      }
    });
  }

  async function excluirTema(id) {
    const data = {
      idPostagem: id
    } 
    handleOpen();
    try {
      const callBackPost = await api.post('/postagem/excluir', data, {
        headers: {
          Authorization: "Bearer " + token
        }
      }); 
      if (callBackPost) {
        if (callBackPost.data.error) {
          swalRegisterError(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
            props.buscarPosts();
          });
        }
        if (callBackPost.data.excluido) {
          swalRegisterSuccess(callBackPost, "OK").then((willSuccess) => {
            handleClose(); 
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
 
  return (
    <div>   
      <MaterialTable
        title={''}
        columns={props.colunas}
        data={props.data}
        /*Ações personalizadas*/
        actions={[ 
          {
            icon: 'add',
            tooltip: 'Adicionar post',
            onClick: (event, rowData) => {
              handleDialogOpen();
            },
            isFreeAction: true
          },
          /*{
            icon: 'edit',
            tooltip: 'Editar post',
            onClick: (event, rowData) => {
              handleEdit(rowData.id_postagem)
            },
          },*/
          {
            icon: 'delete',
            tooltip: 'Excluir post',
            onClick: (event, rowData) => {
              handleDelete(rowData.id_postagem)
            },
          },
        ]}
        /*Coloca as actions na ultima coluna*/
        options={{
          actionsColumnIndex: -1, 
          draggable: false,
          maxBodyHeight: 600,
          pageSize: 10,
          pageSizeOptions: [10, 20, 30],
          headerStyle: {
            backgroundColor: '#99ac8b',
            color: '#FFF',
          },
          actionsCellStyle: {
            display: 'flex',
            justifyContent: 'center',
            padding: '3px',
            width: '100%',
            marginBottom: '-1px',
        },
        }} 
        /*Nomes personalizados*/
        localization={{
          toolbar: {
            searchTooltip: 'Buscar',
            searchPlaceholder: 'Buscar',
          },
          header: {
            actions: props.acao
          },
          body: {
            emptyDataSourceMessage: 'Nenhuma postagem cadastrada'
          },
          pagination: {
            labelRowsSelect: 'registros',
            labelDisplayedRows: '{count} de {from}-{to}',
            firstAriaLabel: 'Primeira Página',
            firstTooltip: 'Primeira Página',
            previousAriaLabel: 'Página Anterior',
            previousTooltip: 'Página Anterior',
            nextAriaLabel: 'Próxima página',
            nextTooltip: 'Próxima página',
            lastAriaLabel: 'Última Página',
            lastTooltip: 'Última Página',
          }
        }}
      />
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTema
        open={dialogOpen}
        handleLogout={props.handleLogout}
        buscarTemas={props.buscarTemas}
        handleDialogClose={handleDialogClose} 
      />
    </div>
  ); 
} 