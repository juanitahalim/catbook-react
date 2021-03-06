import React, { Component } from "react";
import NavBar from "./modules/NavBar.js";
import { Router } from "@reach/router";
import Feed from "./pages/Feed.js";
import NotFound from "./pages/NotFound.js";
import Profile from "./pages/Profile.js";
import Chatbook from "./pages/Chatbook.js";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fab, fas);

// to use styles, import the necessary CSS files
import "../utilities.css";
import "./App.css";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
    };
  }

  componentDidMount() {
    get("/api/whoami").then((user) => {
      if (user._id) {
        // they are registed in the database, and currently logged in.
        this.setState({ userId: user._id });
      }
    });
  }

  handleLogin = (res) => {
    console.log(res);
    // console.log(`Logged in as ${res.profileObj.name}`);
    // const userToken = res.tokenObj.id_token;
    post("/api/login", { code: res.code }).then((user) => {
      this.setState({ userId: user._id });
    });
  };

  setUser = (user) => {
    this.setState({ userId: user._id });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
  };

  // required method: whatever is returned defines what
  // shows up on screen
  render() {
    return (
      // <> is like a <div>, but won't show
      // up in the DOM tree
      <>
        <NavBar
          handleLogin={this.handleLogin}
          setUser={this.setUser}
          logout={this.handleLogout}
          loggedIn={this.state.userId !== undefined}
          userId={this.state.userId}
        />
        <div className="App-container">
          <Router>
            <Feed path="/" userId={this.state.userId} />
            <Profile path="/profile/:userId" />
            <Chatbook path="/chat/" userId={this.state.userId} />
            <NotFound default />
          </Router>
        </div>
      </>
    );
  }
}

export default App;
