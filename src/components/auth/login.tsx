import React, { Component } from "react";
import axios from "axios";
import { Base64 } from "js-base64";
import Deletion from "./deletion";
import Popup from "./popup";
const auth = require("../../keys.json");

type LoginState = {
  username: string;
  password: string;
  scrambled: string;
  id: number;
  showPopUp: boolean;
  showDelete: boolean;
  authLevel: number;
};

type LoginProps = {
  username: string;
  scrambled: string;
  id: number;
  authLevel: number;
  callbackUser: (username: string) => void;
  callbackAuth: (authLevel: number) => void;
  callbackID: (callbackID: number) => void;
  callbackScram: (scrambled: string) => void;
  history?: any;
};

class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      username: this.props.username,
      password: "",
      scrambled: this.props.scrambled,
      id: this.props.id,
      showPopUp: false,
      showDelete: false,
      authLevel: this.props.authLevel
    };
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  loginUser(origin: any) {
    axios({
      method: "get",
      url:
        "/users?$search='" +
        origin.state.username +
        "' AND '" +
        origin.state.scrambled +
        "'",
      baseURL: "http://localhost:8153/api.rsc",
      withCredentials: true,
      auth: {
        username: auth[origin.state.authLevel].user,
        password: auth[origin.state.authLevel].key
      }
    }).then(
      res => {
        if (res.data.value.length === 0) {
          origin.setState({
            showPopUp: true
          });
        } else {
          origin.setState(
            {
              authLevel: 1,
              id: res.data.value[0].ID
            },
            () => {
              origin.props.callbackAuth(origin.state.authLevel);
              origin.props.callbackID(origin.state.id);
              origin.props.callbackUser(origin.state.username);
              origin.props.callbackScram(origin.state.scrambled);
            }
          );

          //console.log(res.data.value);
          origin.props.history.push("/");
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  scramble(pass: string, login: any, origin: any) {
    var temp = Base64.encode(pass);
    origin.setState(
      {
        scrambled: temp
      },
      () => {
        login(origin);
      }
    );
  }

  handleUsernameChange(event: any) {
    this.setState({
      username: event.target.value
    });
  }

  handlePasswordChange(event: any) {
    this.setState({
      password: event.target.value
    });
  }

  loginAttempt(event: any) {
    event.preventDefault();
    if (this.state.username === "" || this.state.password === "") {
      return;
    }
    this.scramble(this.state.password, this.loginUser, this);
  }

  togglePopUp() {
    this.setState({
      showPopUp: !this.state.showPopUp
    });
  }

  createAccount() {
    axios({
      method: "post",
      url: "/users",
      baseURL: "http://localhost:8153/api.rsc",
      withCredentials: true,
      auth: {
        username: auth[0].user,
        password: auth[0].key
      },
      data: {
        name: this.state.username,
        scrambled_pass: this.state.scrambled
      }
    }).then(
      res => {
        this.setState({
          authLevel: 1
        });
      },
      error => {
        console.log(error);
      }
    );

    axios({
      method: "get",
      url:
        "/users?$search='" +
        this.state.username +
        "' AND '" +
        this.state.scrambled +
        "'",
      baseURL: "http://localhost:8153/api.rsc",
      withCredentials: true,
      auth: {
        username: auth[this.state.authLevel].user,
        password: auth[this.state.authLevel].key
      }
    }).then(
      res => {
        this.setState(
          {
            id: res.data.value[0].ID
          },
          () => {
            this.props.callbackUser(this.state.username);
            this.props.callbackAuth(this.state.authLevel);
            this.props.callbackID(res.data.value[0].ID);
            this.props.callbackScram(this.state.scrambled);
          }
        );
        //console.log(res.data.value);
        this.props.history.push("/");
      },
      error => {
        console.log(error);
      }
    );
  }

  logout() {
    this.setState({
      username: "",
      password: "",
      scrambled: "",
      authLevel: 0,
      id: 0
    });
    this.props.callbackAuth(0);
    this.props.callbackUser("");
    this.props.callbackScram("");
    this.props.callbackID(0);
  }

  deleteAccount(event: any) {
    event.preventDefault();
    axios({
      method: "delete",
      url: "/users",
      baseURL: "http://localhost:8153/api.rsc",
      withCredentials: true,
      auth: {
        username: auth[this.state.authLevel].user,
        password: auth[this.state.authLevel].key
      },
      params: {
        ID: this.state.id,
        name: this.state.username,
        scrambled_pass: this.state.scrambled
      }
    }).then(
      res => {
        this.setState({
          username: "",
          password: "",
          scrambled: "",
          authLevel: 0
        });
        this.props.callbackAuth(0);
        this.props.callbackUser("");
        this.props.callbackID(0);
        this.props.callbackScram("");
        this.toggleDelete();
      },
      error => {
        console.log(error);
      }
    );
  }

  toggleDelete() {
    this.setState({
      showDelete: !this.state.showDelete
    });
    //console.log("I made it to handler toggleDelete");
  }

  render() {
    if (this.props.authLevel === 1) {
      //console.log(this.props);
      return (
        <div>
          <h1>
            User {this.props.username} is already signed in.
            <br /> Please logout and login to the account you wish to use.
          </h1>

          <button onClick={this.logout.bind(this)}>Logout</button>

          <br />
          <h2>
            If you wish to delete your account and all its associated
            information, please select the 'Delete' button.
          </h2>
          <button onClick={this.toggleDelete.bind(this)}>Delete</button>
          {this.state.showDelete ? (
            <Deletion
              name={this.state.username}
              confirm={this.deleteAccount.bind(this)}
            />
          ) : null}
        </div>
      );
    }

    return (
      <form>
        <h1>Hello</h1>
        <p>Enter your name, then your password:</p>
        <label>
          Username: <br />
        </label>
        <input
          type="text"
          name="username"
          onChange={this.handleUsernameChange}
        />
        <br />
        <label>
          Password: <br />
        </label>
        <input
          type="password"
          name="password"
          onChange={this.handlePasswordChange}
        />

        <br />

        <button onClick={this.loginAttempt.bind(this)}>Login</button>

        <br />
        <p>
          If you wish to create an account, please enter a name and password
        </p>

        {this.state.showPopUp ? (
          <Popup
            createNew={this.createAccount.bind(this)}
            closePopup={this.togglePopUp.bind(this)}
          />
        ) : null}
      </form>
    );
  }
}

export default Login;
