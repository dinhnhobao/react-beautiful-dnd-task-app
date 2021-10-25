import React, { Component } from 'react';
import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './app.css';
const { TREE } = require('./constants');
const { parseTree } = require('./parser');

const generateOptions = (operators, block_id) => {
    return operators.map((operator, index) => (
        <option id={operator + index} value={operator} style={{ fontFamily: 'Courier New' }}>{operator}</option>
    ));
}

export default class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: TREE.items,
            inputs: TREE.inputs,
            i: 10
        };
    }

    handleChange(event, id, input) {
        const newInputs = JSON.parse(JSON.stringify(this.state.inputs));
        newInputs[id][input] = event.target.value;
        this.setState({ inputs: newInputs });
        console.log(newInputs);
    }

    onClickFunc = () => {
        const newItems = [...this.state.items];
        const newInputs = JSON.parse(JSON.stringify(this.state.inputs));
        newItems.push({ id: this.state.i });
        newInputs[this.state.i] = {
            type: 0,
            input1: "x",
            input2: "1",
        }

        this.setState({ items: newItems, i: this.state.i + 1, inputs: newInputs });
        console.log(this.state);

        console.log(newInputs);
    }

    onDragEnd = (items, item, path) => {
        const newItems = JSON.parse(JSON.stringify(items));
        this.setState(newItems);
        console.log(newItems);
    }

    renderItem = ({ item }) =>
        <div tabIndex="0" onKeyDown={(e) => this.handleDelete(e, item)}>
            {this.getInputField(item.id)}
        </div >;

    getInputField = (id) => {
        let fields = this.state.inputs[id];
        /*
        // json of {
            type:
            input1:
            input2:
        }
        */

        /*
        operator, operand, operand
        */
        switch (fields["type"]) {
            case 0: // +=, -=, *=, /=
                const INC_OPERATORS = ['+=', '-=', '*=', '/='];
                return (
                    <div>
                        {/* <span contentEditable="true"
                            className="input-field"
                            value={this.state.inputs[id]["input1"]} onChange={(e) => this.handleChange(e, id, "input1")}>
                        </span> */}
                        <input size="5" type="text" value={this.state.inputs[id]["input1"]} onChange={(e) => this.handleChange(e, id, "input1")}></input>
                        <select value={this.state.inputs[id]["operator"]} onChange={(e) => this.handleChange(e, id, "operator")}>
                            {generateOptions(INC_OPERATORS, id)}
                        </select>
                        <input size="5" type="text" value={this.state.inputs[id]["input2"]} onChange={(e) => this.handleChange(e, id, "input1")}></input>

                        {/* <span contentEditable="true"
                            className="input-field"
                            value={this.state.inputs[id]["input2"]} onChange={(e) => this.handleChange(e, id, "input2")}>
                        </span> */}
                    </div>
                );
            case 1: // <, <=, >, >=, !=, ==
                const COMP_OPERATORS = ['<', '<=', '==', '>=', '>', '!='];
                return (
                    <div>
                        {/* <span contentEditable="true"
                            className="input-field"
                            value={this.state.inputs[id]["input1"]} onChange={(e) => this.handleChange(e, id, "input1")}>
                        </span> */}
                        <input size="5" type="text" value={this.state.inputs[id]["input1"]} onChange={(e) => this.handleChange(e, id, "input1")}></input>
                        <select value={this.state.inputs[id]["operator"]} onChange={(e) => this.handleChange(e, id, "operator")}>
                            {generateOptions(COMP_OPERATORS, id)}
                        </select>
                        <input size="5" type="text" value={this.state.inputs[id]["input2"]} onChange={(e) => this.handleChange(e, id, "input1")}></input>
                        {/* <span contentEditable="true"
                            className="input-field"
                            value={this.state.inputs[id]["input2"]} onChange={(e) => this.handleChange(e, id, "input2")}>
                        </span> */}
                    </div>
                );
            case 2: // function declaration, def function_name(inputs):
                return (
                    <div>
                        def&nbsp;
                        <input size="5" type="text" value={this.state.inputs[id]["input1"]} onChange={(e) => this.handleChange(e, id, "input1")}></input>
                        (
                        <input size="5" type="text" value={this.state.inputs[id]["input2"]} onChange={(e) => this.handleChange(e, id, "input1")}></input>
                        ):
                    </div>
                );
        }
    }

    handleDelete = (e, item) => {
        const DELETE = "46";
        const BACKSPACE = "8";
        if (e.which === BACKSPACE || e.which === DELETE) { //
            console.log("Delete button pressed");
            this.removeItem(item);
        }
    };

    removeItem = (item) => {
        console.log(`${JSON.stringify(item)} deleting`);

        const newItems = JSON.parse(JSON.stringify(this.state.items));
        console.log(this.removeSearch(newItems, item["id"]) === true);

        console.log(newItems);

        this.setState({ items: newItems, i: this.state.i + 1 });
    }

    removeSearch = (list, id) => {
        /* removes the element from list */

        if (list === undefined) {
            return false;
        }

        for (let i = 0; i < list.length; i++) {
            if (list[i]["id"] === id) { // found
                list.splice(i, 1); // modify newItems
                console.log(`Found!`);
                return true;
                // outer one remove -> what is the behaviour of inner?
            }

            if (list[i].hasOwnProperty("children") && this.removeSearch(list[i]["children"], id)) {
                return true;
            }
        }
        return false;
    }

    render() {
        var tree = parseTree({
            items: this.state.items,
            inputs: this.state.inputs
        })

        var code = <div>
            {tree.map((row, index) => (
                <div>
                    {String.fromCharCode(160).repeat(row.indent) + row.command}
                </div>
            ))}
        </div>

        return (


            <div>
                <button onClick={this.onClickFunc}>
                    Click me
                </button>

                <div className='flex-container'>
                    <div style={{ 'flex': '70%' }} className='code-section'>
                        <div>
                            <Nestable
                                items={this.state.items}
                                renderItem={this.renderItem}
                                onChange={this.onDragEnd}
                            />
                        </div>
                    </div>
                    <div style={{ 'flex': '30%' }} className='vertical-flex-container'>
                        <div style={{ flex: '50%' }}>
                            {code}
                        </div>
                        <div style={{ flex: '50%' }}>
                            1111
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}