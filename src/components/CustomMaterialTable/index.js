import './styles.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable from 'material-table';  

 
export default function CustomMaterialTable(props) { 
  const history = useHistory();
  return (
    <div>   
      <MaterialTable
        title={props.titulo}
        columns={props.colunas}
        data={props.data}
        /*Ações personalizadas*/
        actions={[ 
          {
            icon: 'add',
            tooltip: props.add.tooltip,
            onClick: (event, rowData) => {
              props.add.acao()
            },
            isFreeAction: true
          },
          {
            icon: 'chevron_left',
            tooltip: 'Voltar',
            onClick: () => {
              history.push('/admin/home');
            },
            isFreeAction: true
          }, 
          {
            icon: 'edit',
            tooltip: props.editar.tooltip,
            onClick: (event, rowData) => {
              props.editar.acao(rowData.id)
            },
          },
          {
            icon: 'delete',
            tooltip: props.excluir.tooltip,
            onClick: (event, rowData) => {
              props.excluir.acao(rowData.id)
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
            backgroundColor: '#004725',
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
            actions: 'Ações'
          },
          body: {
            emptyDataSourceMessage: props.msgSemDados
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
          },
        }}
      /> 
    </div>
  ); 
} 