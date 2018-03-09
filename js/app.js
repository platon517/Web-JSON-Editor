import React from 'react'
import ReactDOM from 'react-dom'
import less from 'less'
import {OpenFile} from "./components/open_file";
import {Loading} from "./components/loading";
import {WorkingZone} from "./components/working_zone";
import {AlertMes} from "./components/alert_mes";
import autoBind from "react-autobind";

if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('The File APIs are fine.');
} else {
    console.log('The File APIs are not fully supported in this browser.');
}


class App extends React.Component {
    constructor(props){
        super(props);
        this.state={
            mesText: "",
            isDropped: false,
            isLoaded: false,
            jsonObj: {}, //TestString: "test", TestArr: [1, 2, 3, 4 , 5]
            jsonObjCopy: null,
            ableWork: false
        };
        autoBind(this);
    }
    dropJson(){
        this.setState({
            isDropped: true
        })
    }
    cancelDrop(){
        this.setState({
            isDropped: false
        })
    }
    loaded(obj){
        this.setState({
            ableWork: true,
            isLoaded: true,
            jsonObj: obj,
            jsonObjCopy: JSON.parse(JSON.stringify(obj))
        });
    }
    showMes(text){
        if(this.state.mesText === ""){
            this.setState({
                mesText: text
            });
        }
        setTimeout(()=>{
            this.setState({
                mesText: ""
            });
        }, 4000)
    }
    reset(){
        this.setState({
            jsonObj: JSON.parse(JSON.stringify(this.state.jsonObjCopy))
        });
        alert("JSON has been successfully reset");
    }
    updateJson(path, newVal = null, mode){
        function getName(obj) {
            let isEmpty = true;
            let iter = 0;
            let newName = "NewProperty";
            while(isEmpty){
                if(obj[newName] === undefined){
                    isEmpty = false
                }
                else {
                    iter++;
                    newName = ("NewProperty " + iter);
                }
            }
            if(Array.isArray(obj)){
                newName = obj.length;
            }
            return newName;
        }
        if (path === undefined && mode === "delete"){
            alert("You can't delete root object.");
            return null;
        }
        let updatedJson = JSON.parse(JSON.stringify(this.state.jsonObj));
        if (path === undefined && mode === "add"){
            updatedJson[getName(updatedJson)] = "Value";
            this.setState({
                jsonObj: updatedJson
            });
            return null;
        }
        path = path.split(".");
        let propLink = updatedJson;
        for(let i = 0; i < path.length - 1; i++){
            propLink = propLink[path[i]];
        }
        switch (mode){
            case "change":
                propLink[path[path.length - 1]] = newVal;
                break;
            case "delete":
                if(Array.isArray(propLink)){
                    propLink.splice(path[path.length - 1], 1);
                }
                else {
                    delete propLink[path[path.length - 1]];
                }
                break;
            case "add":
                propLink[path[path.length - 1]][getName(propLink[path[path.length - 1]])] = "Value";
                break;
            case "rename":
                for(let prop in propLink){
                    if(propLink.hasOwnProperty(prop)){
                        let propCopy = JSON.parse(JSON.stringify(propLink[prop]));
                        let newPropName;
                        if(prop === path[path.length - 1]){
                            newPropName = newVal;
                        }
                        else {
                            newPropName = prop;
                        }
                        delete propLink[prop];
                        while(propLink.hasOwnProperty(newPropName)){
                            newPropName = `${newPropName} (duplicate)`;
                        }
                        propLink[newPropName] = propCopy;
                    }
                }
                //console.log(propCopy);
                //delete propLink[path[path.length - 1]];
                //propLink[newVal] = propCopy;
                break;
        }
        this.setState({
            jsonObj: updatedJson
        });
    }
    render() {
        let content;
        if (this.state.isDropped === true && this.state.isLoaded === false) content = <Loading/>;
        if (this.state.isDropped === true && this.state.isLoaded === true && this.state.ableWork === true) content =
            <WorkingZone
                updateJson={this.updateJson}
                showMes={this.showMes}
                jsonObj={this.state.jsonObj}
                reset={this.reset}
                path={"test"}
            />;
        if (this.state.isDropped === false) content =  <OpenFile cancelDrop={this.cancelDrop} dropEvent={this.dropJson} loaded={this.loaded}/>;
        return (
            <div className="allContent">
                {content}
                {
                    this.state.mesText !== "" ? <AlertMes text={this.state.mesText}/> : null
                }
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById("root")
);