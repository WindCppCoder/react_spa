import React, { Component } from "react";
import{
    Route, NavLink, HashRouter
} from "react-router-dom";
import Home from "./Home";
import Stuff from "./Stuff";
import Table from "./Table";
import Login from "./Login";
 
class Main extends Component {
  render() {
    return (
        <HashRouter>
            <div>
                <h1>Simple SPA</h1>
                <ul className="header">
                    <li><NavLink exact to ="/">Home</NavLink></li>
                    <li><NavLink to ="/stuff">Stuff</NavLink></li>
                    <li><NavLink to ="/table">Table</NavLink></li>
                    <li style={{"float":'right'}}> <NavLink to ="/login"> Login</NavLink></li>
                </ul>
                <div className="content">
                    <Route exact path = "/" component = {Home}/>
                    <Route path = "/stuff" component = {Stuff}/>
                    <Route path = "/table" component = {Table}/>
                    <Route path = "/login" component = {Login}/>
                </div>
            </div>
        </HashRouter>
    );
  }
}
 
export default Main;