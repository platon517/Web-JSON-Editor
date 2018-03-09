import React from 'react'
import autoBind from "react-autobind";

export class ControlPanel extends React.Component {
    constructor(props){
        super(props);
        autoBind(this);
    }
    copyClick(){
        this.refs.textArea.value = JSON.stringify(this.props.jsonObj);
        this.refs.textArea.select();
        document.execCommand("Copy");
        //this.props.showMes("Successfully copied");
        alert("Successfully copied");
    }
    resetClick(){
        this.props.reset();
    }
    download() {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.props.jsonObj)));
        element.setAttribute('download', "GeneratedJson.json");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    render(){
        return(
            <div className="controlPanel">
                <div className="two_buttons">
                    <div onClick={this.copyClick} className="copy">COPY TO CLIPBOARD</div>
                    <div className="padding" style={{display: "table-cell", width: "10px"}}/>
                    <div onClick={this.resetClick} className="edit">RESET</div>
                </div>
                <div onClick={this.download} className="download">DOWNLOAD JSON</div>
                <textarea ref={"textArea"} className="fakeTextArea" />
            </div>
        );
    }
}