import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './styles.css';
import { useHistory } from 'react-router-dom';
import ToastAnimated from '../../../components/Toasts'; 
import swal from 'sweetalert'; 
import Header from '../../../components/HeaderDashboard';
import { logout } from '../../../services/auth.js';
//Material UI
import { makeStyles } from '@material-ui/core/styles';
//Tab panels
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
//Listas  
import Postagens from './Postagens'; 
import Temas from './Temas'; 
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
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
  },
}));

export default function Home() {
  const history = useHistory();
  const classes = useStyles();
  //Tab panels
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleLogout() {
    logout();
    history.push('/');
  }
  
  return (
    <>
      <Header
        logout={handleLogout}
      />
      <ToastAnimated />
      <div className={classes.panels}>
        <AppBar position="static" style={{ color: '#fff', backgroundColor: '#99ac8b', fontWeight: 700 }} elevation={0}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="tabs"
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
          >
            <Tab label="Postagens" {...a11yProps(0)} /> 
            <Tab label="Temas" {...a11yProps(0)} /> 
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <Postagens />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Temas />
        </TabPanel> 
      </div>
    </>
  );
}