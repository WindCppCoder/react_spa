import React, { Component } from "react";
import "./table.css";
 
class Table extends Component {
  constructor(props) {
    super(props)
    this.state = {
      weightEntry: [
        {name: 'Fatty', weight: 463, date: '2020-03-01'},
        {name: 'Slim', weight: 130, date: '2019-09-10'},
        {name: 'Anorexic', weight: 30, date: '2018-12-13'},
        {name: 'Average', weight: 148, date: '2020-06-21'}
      ]
    }
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
    return (
      <div>
        <h1 id = 'title'>React Dynamic Table</h1>
        <table id ='weightEntries'>
          <tbody>
            <tr> {this.renderTableHeader()} </tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    );
  }
}
 

export default Table;