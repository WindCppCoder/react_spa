import React, { Component } from "react";
import "../style/table.css";
import axios from "axios";
import Moment from "react-moment";
const auth = require("../keys.json");

type TableState = {
  weight: number;
  date: string;
  deleteMode: boolean;
  editMode: boolean;
  weightEntry: { name: string; weight: number; date: string ; entryNum: number}[] | null;

};

type TableProps = {
  username: string;
  password?: string;
  scrambled?: string;
  id: number;
  authLevel: number;
};

class Table extends Component<TableProps, TableState> {
  _isMounted = false;
  constructor(props: TableProps) {
    super(props);

    this.state = {
      weight: 0,
      date: "",
      deleteMode: false,
      editMode: false,
      weightEntry: [
        {name: "", weight: 0, date: "", entryNum: 0}
      ],
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    if (this._isMounted) {
      this.getHistory();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getHistory() {
    axios({
      method: "get",
      url: "/records/?$filter=ID eq " + this.props.id,
      baseURL: "http://localhost:8153/api.rsc",
      withCredentials: true,
      auth: {
        username: auth[this.props.authLevel].user,
        password: auth[this.props.authLevel].key
      }
    }).then(
      res => {
        if (res.data.value.length === 0) {
          this.setState({
            weightEntry: null
          });
        } else {
          var history = [];
          console.log(res.data);
          for (let i = 0; i < res.data.value.length; i++) {
            history.push({
              name: res.data.value[i].name,
              weight: res.data.value[i].weight,
              date: res.data.value[i].date,
              entryNum: res.data.value[i].entryNum
            });
          }
          this.setState({
            weightEntry: history
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteEntry( row: any) {
    const tempDate = new Moment(row.date).props;
    axios({
      method: "delete",
      url: "/records",
      baseURL: "http://localhost:8153/api.rsc",
      withCredentials: true,
      auth: {
        username: auth[this.props.authLevel].user,
        password: auth[this.props.authLevel].key
      },
      params: {
        
        ID: this.props.id,
        name: this.props.username,
        weight: row.weight,
        date: tempDate,
        entryNum: row.entryNum
      }
    }).then(
      res => {
        //this.toggleDelete(event);
        this.getHistory();
      },
      error => {
        console.log(error);
      }
    );
  }

  //incomplete function
  editEntry( row: any){
    //const tempDate = new Moment(row.date).props;
    //const tempDate = new Date(row.date);
    console.log(row.date);
    console.log(this.state.date);
    axios({
      method: "put",
      url: "/records",
      baseURL: "http://localhost:8153/api.rsc",
      withCredentials: true,
      auth: {
        username: auth[this.props.authLevel].user,
        password: auth[this.props.authLevel].key
      },
      params: {
        
        ID: this.props.id,
        name: this.props.username,
        weight: row.weight,
        date: row.date,
        entryNum: row.entryNum
      },
      data: {
        ID: this.props.id,
        name: this.props.username,
        weight: this.state.weight,
        date: this.state.date
      }
    }).then(
      res => {
        //this.toggleEdit(event);
        this.getHistory();
      },
      error => {
        console.log(error);
      }
    );
  }

  createEntry(event: any) {
    event.preventDefault();
    axios({
      method: "post",
      url: "/records",
      baseURL: "http://localhost:8153/api.rsc",
      withCredentials: true,
      auth: {
        username: auth[this.props.authLevel].user,
        password: auth[this.props.authLevel].key
      },
      data: {
        name: this.props.username,
        date: this.state.date,
        weight: this.state.weight,
        ID: this.props.id
      }
    }).then(
      res => {
        this.getHistory();
      },
      error => {
        console.log(error);
      }
    );
  }

  handleWeightChange(event: any) {
    this.setState({
      weight: event.target.value
    });
  }

  handleDateChange(event: any) {
    this.setState({
      date: event.target.value
    });
  }

  renderTableData() {
    return (
      this.state.weightEntry &&
      this.state.weightEntry.map((weightEntry, index) => {
        const { name, weight, date, entryNum } = weightEntry;
        return (
          <tr key={entryNum} onClick={this.returnRowData.bind(this, {name, weight, date, entryNum})} >
            <td> {name} </td>
            <td> {weight} </td>
            <td> {date} </td>
            <td> {entryNum} </td>
          </tr>
        );
      })
    );
  }

  renderTableHeader() {
    return (
      this.state.weightEntry &&
      Object.keys(this.state.weightEntry[0]).map((key, index) => {
        return <th key={index}> {key.toUpperCase()}</th>;
      })
    );
  }

  returnRowData(array: any){
    //event.preventDefault();
    console.log(array);
    if (this.state.deleteMode){
      this.deleteEntry(array);
    }
    else if (this.state.editMode){
      this.editEntry(array); //must have input boxes filled to replace the contents of array. implement this requirement
    }
  }

  toggleDelete(event: any){
    event.preventDefault();
    this.setState({
      deleteMode: !this.state.deleteMode
    });
    
  }

  toggleEdit(event: any){
    event.preventDefault();
    this.setState({
      editMode: !this.state.editMode
    });
  }

  render() {
    if (this.props.authLevel === 0) {
      return (
        <div>
          <h1>
            <li> Please login to view your entry history.</li>
            or
            <li> Create an account to start tracking your weight.</li>
          </h1>
        </div>
      );
    } else {
      if (this.state.weightEntry === null) {
        return (
          <form>
            <h1> You have no entries, why not start keeping track?</h1>
            <li> Please fill out the forms below with a weight and date </li>
            <p>
              Weight: Please do not use negative numbers
              <br />
            </p>
            <input type="number" name="weight" onChange={this.handleWeightChange} />
            <p>
              Date: Please use format 'YYYY-MM-DD'
              <br />
            </p>
            <input type="text" name="date" onChange={this.handleDateChange} />
            <br />
            <button onClick={this.createEntry.bind(this)}>
              Post (click only once)
            </button>
          </form>
        );
      } else {
        return (
          <form>
            <h1 id="title">React Dynamic Table</h1>
            <table id="weightEntries">
              <tbody>
                <tr>{this.renderTableHeader()}</tr>
                {this.renderTableData()}
              </tbody>
            </table>
            <p>
              Weight: Please do not use negative numbers
              <br />
            </p>
            <input type="number" name="weight" onChange={this.handleWeightChange} />
            <p>
              Date: Please use format 'YYYY-MM-DD'
              <br />
            </p>
            <input type="text" name="date" onChange={this.handleDateChange} />
            <br />
            <button onClick={this.createEntry.bind(this)}>
              Post (click only once)
            </button>

            <button style={{"float": "right"}} onClick={ this.toggleDelete.bind(this)}>
              Delete Mode
            </button>

            <button style={{"float": "right"}} onClick={ this.toggleEdit.bind(this)}>
              Edit Mode
            </button>
            <br/>
            <small>
              After clicking Delete Mode, simply click on the row you wish to delete. <br/>
              After clicking Edit Mode, simply type in the corrected information into the date and weight boxes above, then select the row it is meant to edit.
              Click the same button to cancel the Edit/Delete mode when you are finished.
            </small>
          </form>
        );
      }
    }
  }
}

export default Table;
