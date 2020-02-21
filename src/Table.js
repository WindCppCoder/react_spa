import React, { Component } from "react";
import "./table.css";
import axios from "axios";
 
class Table extends Component {
  _isMounted = false;
  constructor(props) {
    super(props)
    
    this.state = {
      //username: this.props.username,
      //id: this.props.id,
      //authLevel: this.props.authLevel,
      weightEntry: [
        {name: 'Fatty', weight: 463, date: '2020-03-01'},
        {name: 'Slim', weight: 130, date: '2019-09-10'},
        {name: 'Anorexic', weight: 30, date: '2018-12-13'},
        {name: 'Average', weight: 148, date: '2020-06-21'}
      ]
    }
  }

  componentDidMount(){
    this._isMounted = true;

    if (this._isMounted){
      this.getHistory();
    }
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  getHistory(){
    let auth = require('./keys.json');
      axios({
        method: 'get',
        url: "/records/?$search=" + this.props.id,
        baseURL: 'http://localhost:8153/api.rsc',
        withCredentials: true,
        auth: {
          username: auth[this.props.authLevel].user,
          password: auth[this.props.authLevel].key
        }
      })
        .then(res => {
          if (res.data.value.length === 0){
            this.setState({
              weightEntry: null
            })
          }
          else {
            var history = [];
            console.log(res.data);
            for (let i = 0; i < res.data.value.length; i++){
              history.push({name: res.data.value[i].name, weight: res.data.value[i].weight, date: res.data.value[i].date});
            }
            this.setState({
              weightEntry: history
            });
          }
        },
        (error) => {
          console.log(error);
        })
  }

  renderTableData(){
    return this.state.weightEntry.map((weightEntry, index) => {
      const {name, weight, date} = weightEntry
      return (
        <tr key={date}>
          <td> {name} </td>
          <td> {weight} </td>
          <td> {date} </td>
        </tr>
      )
    })
  }

  renderTableHeader(){
    let header = Object.keys(this.state.weightEntry[0])
    return header.map((key, index) => {
      return <th key={index}> {key.toUpperCase()}</th>
    })
  }

  render() {
    if (this.props.authLevel === 0){
      return (
        <div>
          <h1> 
            <li> Please login to view your entry history.</li>
            or
            <li> Create an account to start tracking your weight.</li>
          </h1>
        </div>
      )
    }
    else  {
      if (this.state.weightEntry === null){
        return(
          <h1> You have no entries, why not start keeping track?</h1>
        )
      }
      else {
        return (
          <div>
            <h1 id = 'title'>React Dynamic Table</h1>
            <table id ='weightEntries'>
              <tbody>
                <tr>{this.renderTableHeader()}</tr>
                {this.renderTableData()}
              </tbody>
            </table>
          </div>
        )
      }
    }
  }
}

export default Table;