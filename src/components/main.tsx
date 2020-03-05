import React, { Component } from "react";
import { Route, NavLink, HashRouter } from "react-router-dom";
import Home from "./home";
import Table from "./table";
import Login from "./auth/login";

type MainState = {
  username: string;
  scrambled: string;
  id: number;
  authLevel: number;
};

class Main extends Component<{}, MainState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      authLevel: 0,
      username: "",
      scrambled: "",
      id: 0
    };
  }

  componentDidMount(){
    //const state = localStorage.getItem('state');
    const authority = sessionStorage.getItem('authLevel') === '1';
    let usernameTemp = authority ? sessionStorage.getItem('username') : "";
    let scrambledTemp = authority ? sessionStorage.getItem('scrambled') : "";
    let idTemp = sessionStorage.getItem('id');

    let authLevel: number, id: number, username: string, scrambled: string;
    if (!authority){
      authLevel = 0;
      username = "";
      scrambled = "";
      id = 0;
    }
    else {
      authLevel = 1;
      username = usernameTemp !== null ? usernameTemp : "";
      scrambled = scrambledTemp !== null ? scrambledTemp : "";
      id = idTemp !== null ? JSON.parse(idTemp) : 0;
    }
    this.setState({
      authLevel: authLevel,
      username: username,
      scrambled: scrambled,
      id: id
    });
  }

  callbackForUser = (username: string) => {
    this.setState({
      username: username
    }, () =>
    sessionStorage.setItem('username', this.state.username));
  };

  callbackForAuth = (authLevel: number) => {
    this.setState({
      authLevel: authLevel
    }, () => 
    sessionStorage.setItem('authLevel', JSON.stringify(this.state.authLevel)));
  };

  callbackForID = (id: number) => {
    this.setState({
      id: id
    }, () =>
    sessionStorage.setItem('id', JSON.stringify(this.state.id)));
  };

  callbackForScram = (scrambled: string) => {
    this.setState({
      scrambled: scrambled
    }, () =>
    sessionStorage.setItem('scrambled', this.state.scrambled));
  };

  render() {
    return (
      <HashRouter>
        <div>
          {this.state.username === "" ? (
            <h1> Hello there, </h1>
          ) : (
            <h1> Hello {this.state.username},</h1>
          )}
          <ul className="header">
            <li>
              <NavLink exact to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/table">Table</NavLink>
            </li>
            <li style={{ float: "right" }}>
              <NavLink to="/login"> Login/Logout</NavLink>
            </li>
          </ul>
          <div className="content">
            <Route
              exact
              path="/"
              render={props => (
                <Home
                  {...props}
                  authLevel={this.state.authLevel}
                  username={this.state.username}
                />
              )}
            />
            <Route
              path="/table"
              render={props => (
                <Table
                  {...props}
                  authLevel={this.state.authLevel}
                  username={this.state.username}
                  id={this.state.id}
                />
              )}
            />
            <Route
              path="/login"
              render={props => (
                <Login
                  {...props}
                  authLevel={this.state.authLevel}
                  username={this.state.username}
                  id={this.state.id}
                  scrambled={this.state.scrambled}
                  callbackUser={this.callbackForUser}
                  callbackAuth={this.callbackForAuth}
                  callbackID={this.callbackForID}
                  callbackScram={this.callbackForScram}
                />
              )}
            />
          </div>
        </div>
      </HashRouter>
    );
  }
}

export default Main;
