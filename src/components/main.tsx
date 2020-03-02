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
  
  storeSession = () => {
    const { authLevel, username, scrambled, id} = this.state;
    sessionStorage.setItem('authLevel', JSON.stringify(authLevel));
    sessionStorage.setItem('username', authLevel === 1 ? username : '');
    sessionStorage.setItem('scrambled', authLevel === 1 ? scrambled : '');
    sessionStorage.setItem('id', authLevel === 1 ? JSON.stringify(id) : '');
  }

  /*componentDidMount(){
    const authority = sessionStorage.getItem('authLevel') === '1';
    const username = authority ? sessionStorage.getItem('username') : '';
    const scrambled = authority ? sessionStorage.getItem('scrambled') : '';
    const id = authority ? sessionStorage.getItem('id') : 0;
    const authLevel = 1;
      this.setState({
        authLevel, username, scrambled, id
      });
  }*/

  callbackForUser = (username: string) => {
    this.setState({
      username: username
    });
  };

  callbackForAuth = (authLevel: number) => {
    this.setState({
      authLevel: authLevel
    });
  };

  callbackForID = (id: number) => {
    this.setState({
      id: id
    });
  };

  callbackForScram = (scrambled: string) => {
    this.setState({
      scrambled: scrambled
    });
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
                  storeSession={this.storeSession}
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
