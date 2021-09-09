import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography'; 
//Drawer
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
//Icons
//import HomeIcon from '@material-ui/icons/Home'; //Início  
//import SairIcon from '@material-ui/icons/ExitToApp'; //Sair
import MenuIcon from '@material-ui/icons/Menu'; //Menu Mobile
import CloseIcon from '@material-ui/icons/Close'; //Fechar  

import { HomeIcon, PerfilIcon, SairIcon } from '../Icones/index';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(-2),
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    fontSize: '2rem',
    fontWeight: 900,
    letterSpacing: '0.025em',
    textAlign: 'left',
    color: 'rgb(60, 13, 153)',
    lineHeight: 1.375,
    display: 'inline-block',
    maxWidth: '100%',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
    marginRight: '1px'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth, 
    backgroundColor: "#004725"
  },
  btnSelected: {
    color: '#FFFFFF',
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderColor: '#FFFFFF'
  },
  btn: {
    color: '#FFFFFF',
  }
}));

export default function Header(props) {
  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen)
  }

  return (
    <div className={classes.grow}>
      <AppBar position="sticky" style={{ backgroundColor: "#004725"}} elevation={0}>
        <Toolbar>
          <Link to={'/'+window.location.href.split('/')[3]+'/home'} >
            <Typography className={classes.title} noWrap>
              <img alt="SINUELO" src={require('../../assets/logo-header.png')} style={{ maxWidth: "8ch", marginTop: "0.3em" }} />
            </Typography>
          </Link>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Link to={'/'+window.location.href.split('/')[3]+'/home'} >
              <Button className={window.location.href.split('/')[4] === 'home' ? classes.btnSelected : classes.btn}>
                <HomeIcon />
                <p>INÍCIO</p>
              </Button>
            </Link>  
            <Link to={'/'+window.location.href.split('/')[3]+'/perfil'} >
              <Button className={window.location.href.split('/')[4] === 'perfil' ? classes.btnSelected : classes.btn}>
                <PerfilIcon />
                <p>PERFIL</p>
              </Button>
            </Link>  
            <Button className={classes.btn} onClick={props.logout} >
              <SairIcon />
              <p>SAIR</p>
            </Button>
          </div>

          <div className={classes.sectionMobile} style={{ color: "#021931" }}>
            <IconButton
              style={{ color: "#021931" }}
              aria-label="Abrir menu"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css" >
          <Drawer
            variant="temporary"
            anchor={'right'}

            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <Button onClick={handleDrawerToggle} className={classes.closeMenuButton}  >
              <CloseIcon style={{ color: '#FFFFFF', minWidth: '56px' }} />
            </Button>  
            <Link to={'/'+window.location.href.split('/')[3]+'/home'} >
              <Button className={window.location.href.split('/')[4] === 'home' ? classes.btnSelected : classes.btn} style={{ width: '100%', justifyContent: "left" }}>
                <HomeIcon style={{ minWidth: '56px' }}/>
                <p>INÍCIO</p>
              </Button>
            </Link>  
            <Link to={'/'+window.location.href.split('/')[3]+'/perfil'} >
              <Button className={window.location.href.split('/')[4] === 'perfil' ? classes.btnSelected : classes.btn} style={{ width: '100%', justifyContent: "left" }}>
                <PerfilIcon style={{ minWidth: '56px' }}/>
                <p>PERFIL</p>
              </Button>
            </Link>  
            <Button className={classes.btn} onClick={props.logout} style={{ width: '100%', justifyContent: "left" }}>
              <SairIcon style={{ minWidth: '56px' }} />
              <p>SAIR</p>
            </Button>
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}