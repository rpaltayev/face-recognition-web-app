import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Color from 'color';
import CardActionArea from '@material-ui/core/CardActionArea';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { useFourThreeCardMediaStyles } from '@mui-treasury/styles/cardMedia/fourThree';
import Logo from '../Logo/Logo';
import face_identification from './face_identification.jpg';
import face_detection from './face_detection.jpg';
import { NAV } from '../../constants';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  actionArea: {
    borderRadius: 16,
    transition: '0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  card: ({ color }) => ({
    minWidth: 256,
    borderRadius: 16,
    boxShadow: 'none',
    '&:hover': {
      boxShadow: `0 6px 12px 0 ${Color(color)
        .rotate(-12)
        .darken(0.2)
        .fade(0.5)}`,
    },
  }),
  content: ({ color }) => {
    return {
      backgroundColor: color,
      padding: '1rem 1.5rem 1.5rem',
    };
  },
  title: {
    fontFamily: 'Keania One',
    fontSize: '2rem',
    color: '#fff',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Montserrat',
    color: '#fff',
    opacity: 0.87,
    marginTop: '2rem',
    fontWeight: 500,
    fontSize: 14,
  },
  media: {
    height: 140
  }
}));

const CustomCard = ({ classes, image, title, subtitle, onClick }) => {
  const mediaStyles = useFourThreeCardMediaStyles();

  return (
    <CardActionArea className={classes.actionArea} onClick={onClick} >
      <Card className={classes.card}>
        <CardMedia classes={mediaStyles} image={image} />
        <CardContent className={classes.content}>
          <Typography className={classes.title} variant={'h2'}>
            {title}
          </Typography>
          <Typography className={classes.subtitle}>{subtitle}</Typography>
        </CardContent>
      </Card>
    </CardActionArea>
  );
};


const Home = ({ onRouteChange }) => {
  const classes = useStyles();
  const styles = useStyles({ color: '#c748ae' });
  const styles2 = useStyles({ color: '#00a5b8' });
  return (
    <div className={classes.root}>
      <Logo />
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs>
            <CustomCard
              classes={styles}
              title={'Face Detection'}
              subtitle={'Detect a face and faces from given image.'}
              image={face_detection}
              onClick={() => onRouteChange(NAV.DETECT)}
            ></CustomCard>
          </Grid>
          <Grid item xs>
            <CustomCard
              classes={styles2}
              title={'Face Identification'}
              subtitle={'Identify the person and see if they fall under suspicious group.'}
              image={face_identification}
              onClick={() => onRouteChange(NAV.IDENTIFY)}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
