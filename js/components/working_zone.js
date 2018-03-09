import React from 'react'
import autoBind from "react-autobind";
import {ControlPanel} from "./control_panel";

function RootDot(){
    return <div className="rootIndex"><div/></div>;
}

class InputName extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: this.props.text
        };
        autoBind(this);
    }
    change(e){
        let newVal = e.target.value;
        this.setState({
            text: newVal
        });
    }
    clickAway(e){
        e.preventDefault();
        e.stopPropagation();
        let newVal = e.target.value;
        if(newVal.length < 1){
            //alert("Property name must be named.");
            this.props.renameJson("unnamed property");
            return false;
            //this.refs.input.focus();
        }
        this.props.renameJson(newVal);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            text: nextProps.text
        });
    }
    render(){
        return(
            <input ref={"input"} onBlur={this.clickAway} disabled={this.props.disabled} onChange={this.change} value={this.state.text} className="name"/>
        );
    }
}

class Input extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: this.props.text
        };
        autoBind(this);
    }
    changeText(e){
        let newValue;
        if (this.props.type === "boolean"){
            newValue = e.target.checked;
        }
        else{
            newValue = e.target.value;
        }
        if (this.props.type === "number" && newValue !== ""){
            newValue = parseFloat(newValue);
            if (isNaN(newValue)){
                newValue = 0;
            }
        }
        this.setState({
            text: newValue
        });
        this.props.changeVal(newValue);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            text: nextProps.text
        });
    }
    render(){
        return(
            <div>
                {
                    this.props.type === "boolean" ?
                        <input onChange={this.changeText} checked={this.state.text} type={"checkbox"} className="bool"/>
                        :
                        <input onChange={this.changeText} value={this.state.text} className="SingleInput"/>
                }
            </div>
        );
    }
}

class TypeList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            type: this.props.selected
        };
        autoBind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            type: nextProps.selected
        });
    }
    change(e){
        this.props.changeType(e.target.value);
    }
    render(){
        return(
            <select disabled={this.props.disabled} onChange={this.change} value={this.state.type} className="typeSelector">
                <option value={"object"}>object</option>
                <option value={"array"}>array</option>
                <option value={"string"}>string</option>
                <option value={"number"}>number</option>
                <option value={"boolean"}>boolean</option>
            </select>
        );
    }
}

class SingleElement extends React.Component{
    constructor(props){
        super(props);
        this.state={
            childsContainer: false,
            type: this.props.type
        };
        autoBind(this);
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            type: nextProps.type
        });
    }
    changeType(newType){
        switch (newType){
            case "object":
                this.props.updateJson(this.props.path, {}, "change");
                break;
            case "array":
                this.props.updateJson(this.props.path, [], "change");
                break;
            case "string":
                this.props.updateJson(this.props.path, "string value", "change");
                break;
            case "number":
                this.props.updateJson(this.props.path, 0, "change");
                break;
            case "boolean":
                this.props.updateJson(this.props.path, false, "change");
                break;
        }

        this.setState({
            type: newType
        });

    }
    click(e){
        if(this.props.childs.length >= 0){
            if(e.target.className === "button" && this.state.childsContainer === true && e.target.id !== "showBtn"){
                return false;
            }
            this.setState({
                childsContainer: !this.state.childsContainer
            });
        }
    }
    getColor(type){
        switch (type){
            case "string":
                return "green";
            case "number":
                return "blue";
            case "array":
                return "orange";
            case "boolean":
                return "#bf00ff";
        }
    }
    updateJson(newVal){
        this.props.updateJson(this.props.path, newVal, "change");
    }
    deleteJson(){
        let newVal  = null;
        this.props.updateJson(this.props.path, newVal, "delete");
    }
    addJson(e){
        let newVal  = null;
        this.props.updateJson(this.props.path, newVal, "add");
        this.click(e);
    }
    renameJson(newVal){
        this.props.updateJson(this.props.path, newVal, "rename");
    }
    render(){
        let childs = this.props.childs.map((item, index)=>{
            let type = typeof item.attrObj;
            if (Array.isArray(item.attrObj)) type = "array";
            return <SingleElement
                sayJson={this.props.sayJson}
                key={index}
                rootIndex = {item.rootIndex}
                name = {item.name}
                type = {type}
                childs = {item.childs}
                obj = {item.attrObj}
                parent={item.parent}
                attrName={item.attrName}
                path={this.props.path !== undefined ? (this.props.path + item.attrName) : item.name}
                updateJson={this.props.updateJson}
            />
        });
        let RootDots = [];
        for(let i = 0; i < this.props.rootIndex; i++){
            RootDots.push(<RootDot key={i}/>);
        }
        let editable = false;
        if(this.state.type === "number" || this.state.type === "string" || this.state.type === "boolean"){
            editable = true;
        }
        return(
            <div className="singleElementArea">
                <div className="Dots">
                    {RootDots}
                </div>
                <div className="singleElementHolder">
                    <div className="singleElement">
                        <InputName disabled={Array.isArray(this.props.parent) || this.props.path === undefined} renameJson={this.renameJson} text={this.props.name}/>
                        <div style={{width: !editable ? "160px" : "55px"}} className="controls">
                            {
                                !editable ? <div onClick={this.addJson} title={"Add child"} className="button">+</div> : null
                            }
                            <div onClick={this.deleteJson} title={"Delete element"} className="button">-</div>
                            {
                                !editable ? <div onClick={this.click} title={"Show child"} id={"showBtn"} className="button">{this.state.childsContainer ? "hide" : "show"}</div> : null
                            }
                        </div>
                        <div
                            style={{
                                color: this.getColor(this.state.type),
                                borderColor: this.getColor(this.state.type),
                            }}
                            className="type"><TypeList disabled={this.props.path === undefined} changeType={this.changeType} color={this.getColor(this.state.type)} selected={this.state.type}/>
                        </div>
                    </div>
                    {editable ?
                        <div className="singleElementInput">
                            <Input changeVal={this.updateJson} obj={this.props.obj} text={this.props.obj} type={this.state.type}/>
                        </div> : null
                    }
                </div>
                <div style={{opacity: (this.state.childsContainer ? "1" : "0"), maxHeight: (this.state.childsContainer ? "99999px" : "0")}} className="childsContainer">
                    {childs}
                </div>
            </div>
        );
    }
}

export class WorkingZone extends React.Component {
    constructor(props){
        super(props);
        autoBind(this);
    }
    getChild(parent, rootLvl){
        let childsContainer = [];
        switch (typeof parent){
            case "object":
                if(Array.isArray(parent)){
                    parent.map((item, index)=>{
                        childsContainer.push({
                            rootIndex: rootLvl,
                            name: `${index}`,
                            childs: this.getChild(parent[index], rootLvl + 1),
                            attrObj: parent[index],
                            parent: parent,
                            attrName: `.${index}`,
                        });
                    });
                } else {
                    for(let attribute in parent){
                        if(parent.hasOwnProperty(attribute)){
                            childsContainer.push({
                                rootIndex: rootLvl,
                                name: attribute,
                                childs: this.getChild(parent[attribute], rootLvl + 1),
                                attrObj: parent[attribute],
                                parent: parent,
                                attrName: `.${attribute}`,
                            });
                        }
                    }
                }
                break;
            case "string":
                break;
            default:
                break;
        }
        return childsContainer;
    }
    render(){
        let childs = this.getChild(this.props.jsonObj, 2);
        return(
            <div className="workingZone">
                <SingleElement updateJson={this.props.updateJson} rootIndex = {1} name={"JSON"} type={"object"} childs={childs} obj={null}/>
                <ControlPanel jsonObj={this.props.jsonObj} showMes={this.props.showMes} reset={this.props.reset}/>
            </div>
        );
    }
}