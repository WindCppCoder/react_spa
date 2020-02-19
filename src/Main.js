import React, { Component } from "react";
import{
    Route, NavLink, HashRouter
} from "react-router-dom";
import Home from "./Home";
import Stuff from "./Stuff";
import Table from "./Table";
import Login from "./Login";
 
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authLevel: 0,
            username: "",

        }
    }

    callbackForUser = (userData) => {
        this.setState({
            username: userData
        });
    }

    callbackForAuth = (levelData) => {
        this.setState({
            authLevel: levelData
        });
    }
  render() {
    return (
        <HashRouter>
            <div>
                {this.state.username === "" ? 
                    (<h1> Hello there, </h1>) 
                    : <h1> Hello {this.state.username},</h1>
                }
                <ul className="header">
                    <li><NavLink exact to ="/">Home</NavLink></li>
                    <li><NavLink to ="/stuff">Stuff</NavLink></li>
                    <li><NavLink to ="/table">Table</NavLink></li>
                    <li style={{"float":'right'}}> <NavLink to ="/login"> Login</NavLink></li>
                </ul>
                <div className="content">
                    <Route exact path = "/" render = {(props) => <Home {...props} authLevel={this.state.authLevel} username={this.state.username}/>} />
                    <Route path = "/stuff" render = {(props) => <Stuff {...props} authLevel={this.state.authLevel} username={this.state.username}/>} />
                    <Route path = "/table" render = {(props) => <Table {...props} authLevel={this.state.authLevel} username={this.state.username}/>} />
                    <Route path = "/login" render = {(props) => <Login {...props} authLevel={this.state.authLevel} username={this.state.username} callbackUser={this.callbackForUser} callbackAuth={this.callbackForAuth}/>} />
                </div>
            </div>
        </HashRouter>
    );
  }
}
 
export default Main;