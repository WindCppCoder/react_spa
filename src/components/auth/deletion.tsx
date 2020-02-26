import React, { Component } from "react";

type DeletionProps = {
  name: string;
  confirm: (event: any) => void;
};

class Deletion extends Component<DeletionProps> {
  render() {
    return (
      <div className="deletion">
        <div className="deletion_inner">
          <h1>Please confirm your wish to delete {this.props.name}</h1>
          <button onClick={this.props.confirm}> Confirm Deletion</button>
        </div>
      </div>
    );
  }
}

export default Deletion;
