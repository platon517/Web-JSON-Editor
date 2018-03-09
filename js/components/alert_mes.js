import React from 'react'
import autoBind from "react-autobind";

export class AlertMes extends React.Component {
    render(){
        return(
            <div className="alertMes">
                {this.props.text}
            </div>
        );
    }
}