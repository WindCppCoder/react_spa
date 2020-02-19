import React, { Component } from "react";
import axios from "axios";
import {Base64} from 'js-base64';

class Popup extends Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{"We could not find your username and password in our database."}</h1>
          <li> If you would like to attempt to login again, please close this pop up with the 'Close' button. </li>
          <li>  If you would like to create a new account, please choose the 'Create account' button.</li>
        <button style={{float: 'left'}} onClick={this.props.createNew}>Create account</button>
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
                        //loggedIn: false,
                        showPopUp: false,
                        authLevel: this.props.authLevel};
        this.handleChange = this.handleChange.bind(this);
    }

    loginUser() {
      let auth = require('./keys.json');
      //Object.assign(axios.defaults, { headers: {'user': auth[0].user, 'password': auth[0].key}});
      //axios.get("http://localhost:8153/api.rsc/users?$search= '" + this.state.username + "' AND '" + this.state.scrambled + "'")
      axios({
        method: 'get',
        url: "/users?$search='"+ this.state.username + "' AND '" + this.state.scrambled + "'",
        baseURL: 'http://localhost:8153/api.rsc',
        withCredentials: true,
        auth: {
          username: auth[0].user,
          password: auth[0].key
        }
      })
          .then(res => {
            if (res.data.value.length === 0){
              this.setState({
                showPopUp: true
              });
            }
            else {
              /*this.setState({
                loggedIn: true
              });*/
              console.log(res.data.value);
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
        //this.setState({ [event.target.scrambled] : this.scramble(this.state.password) });
        //console.log(this.state.username);
        //console.log(this.state.password);
        //console.log(this.state.scrambled);
    }

    loginAttempt(event) {
        this.scramble(this.state.password);
        event.preventDefault();
        this.loginUser();
        //console.log(this.state.username);
        console.log(this.state.scrambled);
        //console.log(this.state.loggedIn);
    }

    togglePopUp() {
      this.setState({
        showPopUp: !this.state.showPopUp
      });
    }

    createAccount(){
      let auth = require('./keys.json');
      axios({
        method: 'post',
        url: "/users",
        baseURL: 'http://localhost:8153/api.rsc',
        withCredentials: true,
        auth: {
          username: auth[0].user,
          password: auth[0].key
        },
        data: {
          name: this.state.username,
          scrambled_pass: this.state.scrambled
        }
      })
      .then()
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
          <Popup createNew ={this.createAccount.bind(this)} closePopup={this.togglePopUp.bind(this)}/>
          : null
        }
        </form>


      );
    }
}

export default Login;