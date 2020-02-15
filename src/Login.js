import React, { Component } from "react";
import axios from "axios";
import {Base64} from 'js-base64';

class Popup extends Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{"Incorrect Username or Password"}</h1>
        <button style={{float: 'right'}} onClick={this.props.closePopup}>Close</button>
        </div>
      </div>
    );
  }
}

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {username: '',
                        password: '',
                        scrambled: '',
                        loggedIn: false,
                        showPopUp: false,
                        authorization: "",
                        userLevel: ""};
        this.handleChange = this.handleChange.bind(this);
    }

    loginUser() {
      let auth = require('./keys.json');
      console.log(auth[0]);
      const creds = { headers: {'User': auth[0].user, 'Password': auth[0].key}};
      axios.get("http://localhost:8153/api.rsc/users?$search= '" + this.state.username + "' AND '" + this.state.scrambled + "')", [ creds ])
          .then(res => {
            if (res.data === ''){
              this.setState({
                showPopUp: true
              });
            }
            else {
              this.setState({
                loggedIn: true
              });
            }
          },
          (error) => {
            console.log(error);
          })
          
    }

    scramble(pass){
      var temp = Base64.encode(pass);
      this.setState({
        scrambled: temp
      });
    }
    
    handleChange (event) {
        this.setState({ [event.target.name] : event.target.value });
        this.setState({ [event.target.scrambled] : this.scramble(this.state.password) });
        console.log(this.state.username);
        console.log(this.state.password);
        console.log(this.state.scrambled);
    }

    loginAttempt() {
        this.loginUser();
        console.log(this.state.username);
        console.log(this.state.scrambled);
        console.log(this.state.loggedIn);
    }

    togglePopUp() {
      this.setState({
        showPopUp: !this.state.showPopUp
      });
    }
    render() {
      return (
        <form>
          <h1>Hello</h1>
          <p>Enter your name, then your password:</p>
          <label>Username: <br/></label>
          <input
            type="text" name="username"
            onChange = {this.handleChange}
          />
            <br/>
          <label>Password: <br/></label>
          <input
            type="password" name = "password"
            onChange = {this.handleChange}
            />

        <br/>

        <button onClick={this.loginAttempt.bind(this)}>
            Login
        </button>
        {this.state.showPopUp ? 
          <Popup closePopup={this.togglePopUp.bind(this)}/>
          : null
        }
        </form>


      );
    }
}

export default Login;