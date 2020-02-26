import React, { Component } from "react";

type PopupProps = {
  createNew: () => void;
  closePopup: () => void;
};

class Popup extends Component<PopupProps> {
  render() {
    return (
      <div className="popup">
        <div className="popup_inner">
          <h1>
            {"We could not find your username and password in our database."}
          </h1>
          <li>
            If you would like to attempt to login again, please close this pop
            up with the 'Close' button.
          </li>
          <li>
            If you would like to create a new account, please choose the 'Create
            account' button.
          </li>
          <button style={{ float: "left" }} onClick={this.props.createNew}>
            Create account
          </button>
          <button style={{ float: "right" }} onClick={this.props.closePopup}>
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default Popup;
