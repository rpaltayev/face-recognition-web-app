import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import CameraFrontIcon from '@material-ui/icons/CameraFront';
import { AlertTitle, Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import LinkIcon from '@material-ui/icons/Link';
import { makeStyles } from '@material-ui/core/styles';
import Logo from '../Logo/Logo';
import { DEFAULT_PATH } from '../../constants';


const IdentifyView = ({ persons, groupId, onPersonAdd }) => {

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [alertState, setAlertState] = useState({
    open: false,
    severity: 'warning',
    message: '',
    label: 'Warning',
  });
  const [personFaces, setPersonFaces] = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  const [personName, setPersonName] = useState('');
  const [nameError, setNameError] = useState(false);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlertState({ open: false, severity: 'warning', message: '' });
  };

  const handleAddPerson = () => {
    if (personName.length === 0) {
      setAlertState({ ...alertState, open: true, message: 'Name is required field to create a Person!' })
      return;
    }
    if (personFaces.length === 0) {
      setAlertState({
        ...alertState, open: true, message: 'Add at least one image URL to create a Person!'
      })
      return;
    }
    const requestBody = {
      groupId,
      personName,
      personFaces
    }

    fetch(`${DEFAULT_PATH}/persons`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(response => {
      if (response && response.error) {
        setAlertState({
          open: true,
          severity: 'warning',
          label: 'Warning',
          message: response.error,
        });
      } else if (response) {
        setAlertState({
          open: true,
          severity: 'success',
          label: 'Success',
          message: `Person with name ${response.name} has been created!`
        })
        onPersonAdd(response);
      }
      setPersonFaces([]);
      setPersonName('');
    });
  }

  const handleIdentify = () => {
    if (personFaces.length !== 1) {
      setAlertState({...setAlertState, open: true, message: 'One face is required to identify a person'});
      return;
    }
    const requestBody = {
      url: personFaces[0],
      groupId,
    }

    fetch(`${DEFAULT_PATH}/identify`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
    })
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          setAlertState({
            open: true,
            severity: 'warning',
            label: 'Warning',
            message: response.error,
          });
        } else if (response && response.candidates.length > 0) {
          const detectedPerson = response.candidates[0];
          const found = persons.find(person => person.personId === detectedPerson.personId);
          setAlertState({
            open: true,
            severity: 'error',
            label: 'Error',
            message: `Alert! Alert! ${found.name} has been identified as a suspicous person!`
          });
        } else {
          setAlertState({
            open: true,
            severity: 'success',
            label: 'Safe',
            message: 'The detected persons has been identified to be safe!'
          });
        }
        setPersonFaces([]);
      });
  }

  const handleAddFaces = () => {
    if (selectedIndex === null) {
      setAlertState({
        ...alertState,
        open: true,
        message: 'Person must be selected to add faces!'
      });
      return;
    }
    const selectedPerson = persons[selectedIndex];
    const requestBody = {
      groupId,
      personId: selectedPerson.personId,
      personFaces,
    }
    fetch(`${DEFAULT_PATH}/faces`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        setAlertState({
          open: true,
          severity: 'error',
          label: 'Error',
          message: response.error
        });
      } else if (response && response.personId) {
        setAlertState({
          severity: 'success',
          label: 'Sucess',
          open: true,
          message: `New faces were added to ${selectedPerson.name}`
        });
      } else {
        setAlertState({
          open: true,
          severity: 'warning',
          label: 'Warning',
          message: 'Failed to add all the faces'
        });
      }
      setPersonFaces([]);
    });
  }

  const handleNameChange = (event) => {
    const name = event.target.value;
    setPersonName(name);
    if (name.length > 128) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  }

  const handleUrlChange = (event) => {
    setCurrentUrl(event.target.value);
  }

  const handleAddUrl = (event) => {
    setPersonFaces([...personFaces, currentUrl]);
    setCurrentUrl('');
  }

  const handleDeleteUrl = (idx) => {
    personFaces.splice(idx, 1);
    setPersonFaces([...personFaces]);
  }

  const generatePersons = () => {
    return persons.map((person, idx) => {
      return (
        <ListItem
          button
          selected={selectedIndex === idx}
          onClick={(event) => handleListItemClick(event, idx)}
        >
          <ListItemText primary={person.name} />
        </ListItem>
      )
    })
  }

  const generateUrls = () => {
    return personFaces.map((imageUrl, idx) => {
      const value = imageUrl.length > 30 ? imageUrl.substring(0, 30) + '...' : imageUrl;
      return (
        <ListItem key={idx}>
          <ListItemAvatar>
            <Avatar>
              <ImageIcon color="action" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`Image ${idx + 1}`}
            secondary={value}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDeleteUrl(idx)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    })
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    grid: {
      height: 300,
      background: 'white',
      'border-radius': '10px',
      'box-shadow': '5px 3px 3px #0d47a1'
    },
    list: {
      overflow: 'overlay',
      maxHeight: 300,
    },
    textField: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    alert: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));


  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Logo />
      <Container maxWidth="md">
        <Grid container spacing={3} classes={{ root: classes.grid }}>
          <Grid item xs={6} classes={{ root: classes.list }}>
            <List dense >
              { generateUrls() }
            </List>
          </Grid>
          <Grid item xs={6} >
            <Grid container spacing={3}>
              <Grid item xs={12} >
                <TextField
                  size='medium'
                  autoFocus
                  id="outlined-multiline-static"
                  label="Multiline"
                  multiline
                  fullWidth
                  rows={4}
                  placeholder="Enter the image URL and press 'Add URL'"
                  variant="outlined"
                  onChange={handleUrlChange}
                  value={currentUrl}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required id="standard-required"
                  value={personName}
                  label="Required"
                  error={nameError}
                  onChange={handleNameChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={handleAddUrl}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={currentUrl.length === 0}
                  startIcon={<LinkIcon />}
                >
                  Add URL 
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div style={{height: '40px'}}></div>
          <Grid container spacing={3} >
            <Grid item xs={6} >
              <List>
                { generatePersons() }
              </List>
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={handleAddPerson}
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<PermIdentityIcon />}
              >
                Create 
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={handleAddFaces}
                variant="contained"
                fullWidth
                startIcon={<CameraFrontIcon />}
              >
                Add Face
              </Button>
            </Grid>
            <Grid item xs={2}>
            <Button
              onClick={handleIdentify}
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<CameraFrontIcon />}
            >
              Identify
            </Button>
          </Grid>
          </Grid>          
          <Snackbar open={alertState.open} autoHideDuration={5000} onClose={handleClose} >
            <Alert
              onClose={handleClose}
              severity={alertState.severity}
            >
              <AlertTitle>{ alertState.label }</AlertTitle>
                { alertState.message }
            </Alert>
          </Snackbar>   
      </Container>

    </div>
  )
}

export default IdentifyView;
