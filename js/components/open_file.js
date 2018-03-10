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
        console.log(e.target.files);
        this.SetNewJson(e.target.files[0]);
    }
    SetNewJson(file){
        if(file.name.split(".")[1] === "json"){
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
            //console.log(file);
            alert("file is not .json");
            this.props.cancelDrop();
            this.setState({isDragOver: false});
        }
    }
    ClickFileOpen(){
        this.refs.fileInput.click();
    }
    NewFile(){
        this.setState({isDragOver: false});
        this.props.dropEvent();
        this.props.loaded({
            ObjectPropName: {Prop: "Prop Value"},
            ArrayPropName:[1, 2, 3],
            BooleanPropName: true,
            NumberPropName: 0,
            StringPropName: "Prop Value"
        });
        console.log("kek");
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
                >
                    <div className="dropZoneInner">
                        <img style={{transform: `rotate(${this.state.isDragOver?180:0}deg)`}} src={"img/arrow.svg"}/>
                        {this.state.isDragOver ?
                            <span>Now drop it</span> :
                            <span>Drag <span style={{color:"#698fff"}}>.json</span> file here
                                <p onClick={this.ClickFileOpen} className="clickToChose">Or click to chose</p>
                            </span>
                        }
                        <div onClick={this.NewFile} className="createNewButton">Create new file</div>
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