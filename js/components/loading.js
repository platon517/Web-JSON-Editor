import React from 'react'
import autoBind from "react-autobind";

export class Loading extends React.Component {
    render(){
        return(
            <div className="loading">
                <span>Loading</span>
            </div>
        );
    }
}