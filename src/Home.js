import React, { Component } from "react";

class Home extends Component {
    render() {
        return (
            <div>  
                <h2> Project Requirements  {this.props.username}</h2>
                <p> create a 1 page react project that has a server to retrieve data<br/>
                    some authentication to be able to login<br/>
                    possibly keep track of your weight or something daily and includes history<br/> <br/>

                    possible requirements:<br/>
                    <li>single page app</li>
                    <li>server</li>
                    <li>authentication</li>
                    <li>screen transition</li>
                    <li>state management</li>
                    <li>MobX(preffered) or Redux</li>


                    Most important: Single Page Apps, React.js (state management and component lifecycle), JavaScript (callbacks and async), API data manipulation (retrieve and save)
                </p>
            </div>
        );
    }
}

export default Home;