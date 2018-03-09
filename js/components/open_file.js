import React from 'react'
import autoBind from "react-autobind";

export class OpenFile extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isDragOver: false
        };
        autoBind(this);
    }
    DragOver(e){
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            isDragOver: true
        });
    }
    DragEnter(e){
        e.preventDefault();
        this.setState({isDragOver: true});
    }
    DragLeave(e){
        e.preventDefault();
        this.setState({isDragOver: false});
    }
    DragDropped(e){
        e.preventDefault();
        e.stopPropagation();
        this.SetNewJson(e.dataTransfer.files[0]);
        return false;
    }
    InputDone(e){
        e.preventDefault();
        e.stopPropagation();
        this.SetNewJson(e.target.files[0]);
    }
    SetNewJson(file){
        if(file.type === "application/json"){
            this.setState({isDragOver: false});
            this.props.dropEvent();
            let fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = (e) => {
                let parseJson = new Promise((resolve)=>{
                    let parsedJson = JSON.parse(e.target.result);
                    resolve(parsedJson);
                });
                parseJson.then(
                    result=>{
                        this.props.loaded(result);
                    },
                    error=>{
                        alert(error);
                        this.props.cancelDrop();
                    }
                );
            };
        }
        else{
            alert("file is not .json");
        }
    }
    ClickFileOpen(){
        this.refs.fileInput.click();
    }
    render(){
        return(
            <div className="open_file_zone">
                <div
                    style={{transform: `scale(${this.state.isDragOver?0.95:1})`}}
                    ref={"dropZone"}
                    onDragOver={this.DragOver}
                    onDragEnter={this.DragEnter}
                    onDragLeave={this.DragLeave}
                    onDrop={this.DragDropped}
                    onClick={this.ClickFileOpen}
                >
                    <div className="dropZoneInner">
                        <img style={{transform: `rotate(${this.state.isDragOver?180:0}deg)`}} src={"img/arrow.svg"}/>
                        {this.state.isDragOver?<span>Now drop it</span>:<span>Drag <span style={{color:"#698fff"}}>.json</span> file here<p style={{fontSize: "30px", opacity: "0.8", marginTop: "-5px"}}>Or click to chose</p></span>}
                    </div>
                </div>
                <input
                    ref={"fileInput"}
                    style={{position: "absolute", visibility: "hidden"}}
                    type={"file"}
                    onChange={this.InputDone}
                />
            </div>
        );
    }
}