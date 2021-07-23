import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: '1em',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1, 
  },
}));

export default function HeaderForm(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ backgroundColor: "#021931", textAlign: "center", alignContent: "center" }} elevation={0}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {props.titulo}
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
