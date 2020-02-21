import React, { Component } from "react";
import axios from "axios";
import {Base64} from 'js-base64';
//*** the code is kinda ugly ***//

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

class Deletion extends Component {
  render() {
    return (
      <div className='deletion'>
        <div className='deletion_inner'>
          <h1>
            Please confirm your wish to delete {this.props.name}
          </h1>
          <button onClick={this.props.confirm}> Confirm Deletion</button>
        </div>
      </div>
    );
  }
}

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {username: this.props.username,
                        password: '',
                        scrambled: this.props.scrambled,
                        id: this.props.ID,
                        showPopUp: false,
                        showDelete: false,
                        authLevel: this.props.authLevel};
        this.handleChange = this.handleChange.bind(this);
    }

    loginUser(origin) {
      let auth = require('./keys.json');
      axios({
        method: 'get',
        url: "/users?$search='"+ origin.state.username + "' AND '" + origin.state.scrambled + "'",
        baseURL: 'http://localhost:8153/api.rsc',
        withCredentials: true,
        auth: {
          username: auth[origin.state.authLevel].user,
          password: auth[origin.state.authLevel].key
        }
      })
          .then(res => {
            if (res.data.value.length === 0){
              origin.setState({
                showPopUp: true
              });
            }
            else {
              /*this.setState({
                loggedIn: true
              });*/
              origin.setState({
                authLevel: 1,
                id: res.data.value[0].ID
              }, () => {
              origin.props.callbackAuth(origin.state.authLevel);
              origin.props.callbackID(origin.state.id);
              origin.props.callbackUser(origin.state.username);
              origin.props.callbackScram(origin.state.scrambled);
              });              

              console.log(res.data.value);
              origin.props.history.push('/')
            }
          },
          (error) => {
            console.log(error);
          })
          
    }



    scramble(pass, login, origin){
      var temp = Base64.encode(pass);
      origin.setState({
        scrambled: temp
      }, () => {
          login(origin)
      });
      
    }
    
    handleChange (event) {
        this.setState({ 
          [event.target.name] : event.target.value 
        });
        //this.setState({ [event.target.scrambled] : this.scramble(this.state.password) }); //this one only gets called on changes; hence will always be 1 action off
        //console.log(this.state.username);
        //console.log(this.state.password);
        //console.log(this.state.scrambled);
    }

    loginAttempt(event) {
        event.preventDefault();
        if(this.state.username === "" || this.state.password === ""){
          return;
        }
        this.scramble(this.state.password, this.loginUser, this);
        //this.loginUser();
        //console.log(this.state.username);
        //console.log(this.state.scrambled);
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
      .then(res => {
        this.setState({
          authLevel: 1
        });
      },
      (error) => {
        console.log(error);
      })

      axios({
        method: 'get',
        url: "/users?$search='"+ this.state.username + "' AND '" + this.state.scrambled + "'",
        baseURL: 'http://localhost:8153/api.rsc',
        withCredentials: true,
        auth: {
          username: auth[this.state.authLevel].user,
          password: auth[this.state.authLevel].key
        }
      })
      .then(res => {
        this.setState({
          id: res.data.value[0].ID
        }, () => {
          this.props.callbackUser(this.state.username);
          this.props.callbackAuth(this.state.authLevel);
          this.props.callbackID(this.state.id);
          this.props.callbackScram(this.state.scrambled);
        });
        console.log(res.data.value);
        this.props.history.push('/')
      },
      (error) => {
        console.log(error);
      })
    }

    logout(){
      this.setState({
        username: '',
        password: '',
        scrambled: '',
        authLevel: 0,
        id: 0
      });
      this.props.callbackAuth(0);
      this.props.callbackUser('');
      this.props.callbackScram('');
      this.props.callbackID(0);
    }

    deleteAccount(event){
      event.preventDefault();
      console.log(this.props.id); //for some reason, as yet unknown, this.state.id is undefined but this.props.id is good and correct.
        let auth = require('./keys.json');
        axios({
          method: 'delete',
          url: "/users",
          baseURL: 'http://localhost:8153/api.rsc',
          withCredentials: true,
          auth: {
            username: auth[this.state.authLevel].user,
            password: auth[this.state.authLevel].key
          },
          params: {
            ID: this.props.id,
            name: this.state.username,
            scrambled_pass: this.state.scrambled
          }
        })
        .then(res => {
          this.setState({
            username: '',
            password: '',
            scrambled: '',
            authLevel: 0
          });
          this.props.callbackAuth(0);
          this.props.callbackUser('');
          this.props.callbackID(0);
          this.props.callbackScram('');
          this.toggleDelete();
        },
        (error) => {
          console.log(error);
        })
    }

    toggleDelete(){
      this.setState({
        showDelete: !this.state.showDelete
      });
      console.log("I made it to handler toggleDelete");
    }
    
    render() {
      if (this.props.authLevel >= 1){
        return (
          <div>
            <h1> User {this.props.username} is already signed in. 
            <br/> Please logout and login to the account you wish to use.</h1>

            <button onClick={this.logout.bind(this)}>
              Logout
            </button>

            <br/>
            <h2>
              If you wish to delete your account and all its associated information, please select the 'Delete' button.
            </h2>
            <button onClick={this.toggleDelete.bind(this)}>
              Delete
            </button>
            {this.state.showDelete ?
              <Deletion name={this.state.username} origin={this} confirm={this.deleteAccount.bind(this)}/> 
              : null
            }
          </div>
        )
      }
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

        {this.state.showDelete ?
          <Deletion name={this.state.username} confirm={this.deleteAccount.bind(this)}/> 
          : null
        }
        </form>


      );
    }
}

export default Login;