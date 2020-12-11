import React, { Component } from "react";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import IdentifyView from "./components/IdentifyView/IdentifyView";
import Home from "./components/Home/Home";
import "./App.css";
import "tachyons";
import { DEFAULT_PATH, NAV } from "./constants";

const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

const initialState = {
  input: "",
  imageUrl: "",
  boxArray: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    persons: [],
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  calculateFaceLocation = data => {
    const clarifaiFace = data.outputs[0].data.regions;
    const boxes = [];
    const result = [];
    for(let i = 0; i<clarifaiFace.length; i++){
      boxes[i] = clarifaiFace[i].region_info.bounding_box;
    }

    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    for(let i=0; i<boxes.length; i++) {
      result[i] = {
        leftCol: boxes[i].left_col * width,
        topRow: boxes[i].top_row * height,
        rightCol: width - boxes[i].right_col * width,
        bottomRow: height - boxes[i].bottom_row * height
      }
    }
    return result;
  };

  loadUser = data => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
        groupId: data.groupid,
        persons: data.persons,
      }
    });
  };
  displayFaceBox = box => {
    this.setState({ boxArray: box });
  };
  onInputChange = event => {
    this.setState({ input: event.target.value });
  };

  onPeronAdd = (person) => {
    const user = this.state.user;
    this.setState({
      user: {
        ...user,
        persons: [...user.persons, person ]
      }
    })
  }


  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch(`${DEFAULT_PATH}/imageurl`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch(`${DEFAULT_PATH}/image`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === NAV.SIGN_OUT) {
      this.setState(initialState);
    } else if (route === NAV.HOME) {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  getConent = () => {
    const { imageUrl, route, boxArray, user } = this.state;
    if (route === NAV.HOME) {
      return (<Home onRouteChange={this.onRouteChange} />);
    } else if (route === NAV.IDENTIFY) {
      return (<IdentifyView persons={user.persons} groupId={user.groupId} onPersonAdd={this.onPeronAdd} />);
    } else if (route === NAV.DETECT) {
      return (
        <div>
          <Logo />
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition imageUrl={imageUrl} boxArray={boxArray} />
        </div>
      );
    } else if (route === NAV.SIGN_IN) {
      return (<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />);
    } else {
      return (<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />);
    }
  }

  render() {
    const { isSignedIn } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { this.getConent() }
      </div>
    );
  }
}

export default App;
