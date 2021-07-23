import React from 'react'; 
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card'; 
import CardContent from '@material-ui/core/CardContent'; 
import Typography from '@material-ui/core/Typography'; 
import Grid from '@material-ui/core/Grid';  

const useStyles = makeStyles({
  root: { 
    maxWidth: 430,
    height: 120, 
    backgroundColor: '#004725',
    padding: '1em',
    margin: '1em', 
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    cursor: 'pointer',
    userSelect: 'none'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 40,
    fontFamily: 'Bebas Neue',
    color: '#FFFFFF', 
  },
  pos: {
    marginBottom: 12,
  },
  icone: {
    maxWidth: '100%', 
    marginRight: '1em', 
    width: '8ch', 
  }
});

export default function CardButton(props) {
  const classes = useStyles(); 

  return (
    <Link to={`/admin/${props.url}`}> 
      <Card className={classes.root} onClick={props.acao}>
        <CardContent>
          <Grid container spacing={1} style={{ marginTop: '1em', alignItems: 'center' }}> 
            <img src={props.icone} className={ classes.icone } />
            <Typography className={classes.title} >
              {props.titulo}
            </Typography> 
          </Grid>
        </CardContent> 
      </Card>
    </Link>
  );
}
