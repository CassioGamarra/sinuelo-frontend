import './styles.css';
import React from 'react';
import { useHistory } from 'react-router-dom';
import MaterialTable from 'material-table';   
 
export default function CustomMaterialTableReports(props) { 
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
            icon: 'chevron_left',
            tooltip: 'Voltar',
            onClick: () => {
              history.push('/admin/home');
            },
            isFreeAction: true
          },  
        ]}
        /*Coloca as actions na ultima coluna*/
        options={{
          actionsColumnIndex: 0, 
          draggable: false,
          exportButton: true, 
          exportAllData: true,
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
          toolbar:{
            searchTooltip: 'Buscar',
            searchPlaceholder: 'Buscar',
            exportAriaLabel: 'Salvar Relatório',
            exportTitle: 'Salvar Relatório',
            exportPDFName: 'Salvar em PDF',
            exportCSVName: 'Salvar em CSV',
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