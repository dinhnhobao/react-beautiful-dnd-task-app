import React, { Component } from 'react';
import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './app.css';
// import './syntax-highlighting.css';
import ReactTooltip from 'react-tooltip';
import FileSaver from 'file-saver';

import Drag from './images/drag-flick.png';
import Drop from './images/drop-here.png';
import Add from './images/add.svg';
import Save from './images/save.png';

import Highlight from 'react-highlight';

const { MODEL_BLOCKS, TREE, SHORT_TREE, SHORT_PROGRAM } = require('./constants');
const { parseBlock, parseTree, getFileOutput } = require('./parser');

const generateOptions = (operators, block_id) => {
    return operators.map((operator, index) => (
        <option id={operator + index} value={operator} style={{ fontFamily: 'Courier New' }}>{operator}</option>
    ));
}

const handlerStub = () => null;

const input1_div_model = (
    <input style={{ width: '40px', height: '11px', fontFamily: 'Courier New', fontSize: '2.5vh' }} />
)

const input2_div_model = (
    <input style={{ width: '40px', height: '11px', fontFamily: 'Courier New', fontSize: '2.5vh' }} />
)

export default class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // items: TREE.items,
            // inputs: TREE.inputs,
            items: SHORT_PROGRAM.items,
            inputs: SHORT_PROGRAM.inputs,
            i: 10000,
            droppableData: '',
            isChildDragging: false,
            fileName: 'count',
        };
    }

    handleInputChange(event, id, input) {
        const newInputs = JSON.parse(JSON.stringify(this.state.inputs));
        newInputs[id][input] = event.target.value;
        this.setState({ inputs: newInputs }, () => {
            if (input === "operator") {
                return;
            }

            // change input field size
            console.log(document.getElementById(`${id}-${input}`));
            document.getElementById(`${id}-${input}`).style.width = `${this.state.inputs[id][input].length}ch`; // set width according to length of input field
        });
    }

    handleFileNameChange = (event) => {
        this.setState({
            fileName: event.target.value
        });
    }

    addBlock = (e, type) => { // index in model blocks
        const newItems = [...this.state.items];
        const newInputs = JSON.parse(JSON.stringify(this.state.inputs));
        newItems.push({ id: this.state.i });
        newInputs[this.state.i] = MODEL_BLOCKS.filter(block => block.type === type)[0];

        this.setState({ items: newItems, i: this.state.i + 1, inputs: newInputs }, () => {
            if (type == 7) { // if -> also push elif and else
                this.addBlock(e, 8);
            } else if (type == 8) {
                this.addBlock(e, 9);
            } else if (type == 2) { // def -> push return function
                this.addBlock(e, 4);
            }
        });
    }

    onDragEnd = (items, item, path) => {
        const newItems = JSON.parse(JSON.stringify(items));
        this.setState(newItems);
    }

    renderItem = ({ item }) =>
        <div tabIndex="0" onKeyDown={(e) => this.handleDelete(e, item)}>
            {this.getInputField(item.id)}
        </div>;

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
        // const input1_length = this.state.inputs[id].hasOwnProperty("input1") ? this.state.inputs[id]
        // console.log(this.state.inputs[id]);
        // console.log(this.state.inputs[id].hasOwnProperty("input2"));

        const input1_div = (
            <div style={{ display: 'inline-block', width: '1vw !important' }}>
                <input id={`${id}-input1`} size={20} style={{ fontSize: '2vh', width: `${this.state.inputs[id]["input1"]}ch` }} value={this.state.inputs[id]["input1"]}
                    onChange={(e) => this.handleInputChange(e, id, "input1")}
                    style={{
                        width: `${this.state.inputs[id].hasOwnProperty("input1") ?
                            this.state.inputs[id]['input1'].length + "ch" : ''}`,
                        fontFamily: 'Courier New',
                        fontSize: '2.5vh'
                    }} />
            </div >
        );

        const input2_div = (
            <input id={`${id}-input2`} style={{ fontSize: '2vh', width: `${this.state.inputs[id]["input2"]}ch` }} value={this.state.inputs[id]["input2"]}
                onChange={(e) => this.handleInputChange(e, id, "input2")}
                style={{
                    width: `${this.state.inputs[id].hasOwnProperty("input2") ?
                        this.state.inputs[id]['input2'].length + "ch" : ''}`,
                    fontFamily: 'Courier New',
                    fontSize: '2.5vh'
                }} />
        )

        switch (fields["type"]) {
            case 0:
                var OPERATORS = ['+=', '-=', '*=', '/='];

                var options = <select style={{ fontFamily: 'Courier New', fontSize: '2.5vh' }} value={this.state.inputs[id]["operator"]} onChange={(e) => this.handleInputChange(e, id, "operator")}>
                    {generateOptions(OPERATORS, id)}
                </select>
                return (
                    <div>
                        {input1_div}
                        &nbsp;
                        {options}
                        &nbsp;
                        {input2_div}
                    </div>
                );
            case 1: case 5: // or
                var OPERATORS;
                if (fields["type"] === 1) {
                    OPERATORS = ['<', '<=', '==', '>=', '>', '!='];
                } else if (fields["type"] === 5) {
                    OPERATORS = ['and', 'or'];
                }
                var options = <select style={{ fontFamily: 'Courier New', fontSize: '2.5vh' }} value={this.state.inputs[id]["operator"]} onChange={(e) => this.handleInputChange(e, id, "operator")}>
                    {generateOptions(OPERATORS, id)}
                </select>

                return (
                    <div>
                        <div style={{ display: "inline-block" }}>
                            {input1_div}
                            &nbsp;
                            {options}
                            &nbsp;
                            {input2_div}
                        </div>
                        <div draggable
                            onClick={(e) => {
                                e.stopPropagation();
                                this.setState({ isChildDragging: true })
                            }}
                            onDragStart={(e) => this.onDragStart(e, id)}
                            onDrag={(e) => this.onDrag(e)}
                            style={{ display: "inline-block" }}>
                            <img src={Drag} width={15} height={15}></img>
                        </div>
                    </div >
                );
            case 3:
                return (
                    <div>
                        {input1_div}
                        &nbsp;=&nbsp;
                        {input2_div}
                    </div>
                );
            case 2: // function declaration, def function_name(inputs):
                return (
                    <div>
                        def&nbsp;
                        {input1_div}
                        (
                        {input2_div}
                        ):
                    </div>
                );
            case 4: // return
                return (
                    <div>
                        return&nbsp;
                        {input1_div}
                    </div>
                );
            case 6: // for i in range
                return (
                    <div>
                        for&nbsp;{input1_div}&nbsp;in&nbsp;range(
                        {input2_div}
                        ):
                    </div>
                );
            case 7:
                return (
                    <div>
                        <div style={{ display: 'inline-block' }}>
                            if&nbsp;({input1_div}):
                        </div>
                        <div onDragOver={(e) => this.onDragOver(e)}
                            onDrop={(e) => this.onDrop(e, id)}
                            style={{ display: 'inline-block' }}
                        >
                            <img src={Drop} width={15} height={15}></img>
                        </div>
                    </div >
                );
            case 8:
                return (
                    <div>
                        elif&nbsp;({input1_div}):
                    </div>
                );
            case 9:
                return (
                    <div>
                        else:
                    </div>
                );
            case 10: // print
                return (
                    <div>
                        print({input1_div})
                    </div>
                );
        }
    }

    handleDelete = (e, item) => {
        /*
        Current block remove will remove all corresponding children
        To-do: unindent the remaining childrens
        */
        const DELETE = 46;
        if (e.which === DELETE) { //
            console.log("Delete button pressed");
            this.removeItem(item);
        }
    };

    removeItemById = (id) => {
        const newItems = JSON.parse(JSON.stringify(this.state.items));
        console.log(this.removeSearch(newItems, id) === true);
        // console.log(newItems);
        // console.log(id, typeof id);
        this.setState({ items: newItems, i: this.state.i + 1 });
    }

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

    onDragOver = (e) => {
        e.preventDefault(); // allow element to drag over
    }

    onDrop = (e, id) => { // code for dragging logical statement (case 5) and drop to if statement
        let input1 = e.dataTransfer.getData("input1");
        let input2 = e.dataTransfer.getData("input2");
        let operator = e.dataTransfer.getData("operator");
        let source = parseInt(e.dataTransfer.getData("source"));

        console.log(`onDrop called`);

        const newInputs = JSON.parse(JSON.stringify(this.state.inputs));
        newInputs[id]["input1"] = parseBlock({ type: 5, input1, input2, operator });

        this.setState({
            inputs: newInputs
        }, () => {
            this.setState({ isChildDragging: false });
        });

        console.log(source);
        // remove expression block
        this.removeItemById(source);
        console.log(`Destination id ${id}`);
    }

    onDragStart = (e, id) => { // code for dragging logical statement (case 5) and drop to if statement
        console.log("Drag started");
        e.dataTransfer.setData("input1", this.state.inputs[id].input1); // DataTransfer object is used to hold the data that is being dragged during a drag and drop operation.
        e.dataTransfer.setData("input2", this.state.inputs[id].input2);
        e.dataTransfer.setData("operator", this.state.inputs[id].operator);
        e.dataTransfer.setData("source", id);
        console.log(`source id ${id}`)
    }

    onDrag = (e) => {
        this.setState({ isChildDragging: false });
    }

    onDragExpressionEnd = (e) => {
        this.setState({ isChildDragging: false });
    }

    onSaveFile = (e) => {
        const outputString = getFileOutput(parseTree({
            items: this.state.items,
            inputs: this.state.inputs
        }));
        console.log(outputString);
        var blob = new Blob([outputString], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, `${this.state.fileName}.py`);
    }

    render() {
        const choosingColumn =
            <div>
                {MODEL_BLOCKS.map((block, index) => {
                    switch (block.type) {
                        case 0: case 1:
                            var OPERATORS;
                            if (block.type === 0) {
                                OPERATORS = ['+=', '-=', '*=', '/='];
                            } else if (block.type === 1) {
                                OPERATORS = ['<', '<=', '==', '>=', '>', '!='];
                            }
                            var options = <select style={{ fontFamily: 'Courier New', fontSize: '2.5vh' }}>
                                {generateOptions(OPERATORS, "")}
                            </select>
                            return (
                                <div>
                                    {input1_div_model}
                                    &nbsp;
                                    {options}
                                    &nbsp;
                                    {input2_div_model}

                                    <img src={Add} width={15} height={15} onClick={(e) => this.addBlock(e, block.type)} />
                                </div>

                            );
                        case 5: // or
                            var OPERATORS = ['and', 'or'];
                            var options = <select style={{ fontFamily: 'Courier New', fontSize: '2.5vh' }}>
                                {generateOptions(OPERATORS, "")}
                            </select>

                            return (
                                <div>
                                    <div style={{ display: "inline-block" }}>
                                        {input1_div_model}
                                        &nbsp;
                                        {options}
                                        &nbsp;
                                        {input2_div_model}
                                    </div>
                                    <img src={Add} width={15} height={15} onClick={(e) => this.addBlock(e, block.type)} />
                                </div>
                            );
                        case 3:
                            return (
                                <div>
                                    {input1_div_model}
                                    &nbsp;=&nbsp;
                                    {input2_div_model}
                                    <img src={Add} width={15} height={15} onClick={(e) => this.addBlock(e, block.type)} />
                                </div >
                            );
                        case 2: // function declaration, def function_name(inputs):
                            return (
                                <div>
                                    def&nbsp;
                                    {input1_div_model}
                                    (
                                    {input2_div_model}
                                    ):
                                    <img src={Add} width={15} height={15} onClick={(e) => this.addBlock(e, block.type)} />
                                </div >
                            );
                        case 4: // return
                            return (
                                <div>
                                    return&nbsp;
                                    {input1_div_model}
                                    <img src={Add} width={15} height={15} onClick={(e) => this.addBlock(e, block.type)} />
                                </div >
                            );
                        case 6: // for i in range
                            return (
                                <div>
                                    for&nbsp; {input1_div_model}&nbsp;in&nbsp;range(
                                    {input2_div_model}
                                    ):
                                    <img src={Add} width={15} height={15} onClick={(e) => this.addBlock(e, block.type)} />
                                </div >
                            );
                        case 7: // merge with 8, 9
                            return (
                                <div>
                                    <div style={{ display: 'inline-block' }}>
                                        if&nbsp;({input1_div_model}):
                                    </div>
                                    <img src={Add} width={15} height={15} onClick={(e) => this.addBlock(e, block.type)} />
                                    <div>
                                        {String.fromCharCode(160).repeat(4) + "code here..."}
                                    </div>
                                    <div>
                                        elif&nbsp;({input1_div_model}):
                                    </div >
                                    <div>
                                        {String.fromCharCode(160).repeat(4) + "code here..."}
                                    </div>
                                    <div>
                                        else:
                                    </div>
                                    <div>
                                        {String.fromCharCode(160).repeat(4) + "code here..."}
                                    </div>
                                </div >
                            )
                    }
                })}
            </div >;
        var tree = parseTree({
            items: this.state.items,
            inputs: this.state.inputs
        })

        var code = <div>
            {tree.map((row, index) => (
                // To-do: handle long statements
                <div>
                    <Highlight language="python">
                        {String.fromCharCode(160).repeat(row.indent) + row.command}
                    </Highlight>
                </div>
            ))}
        </div>

        console.log("items");
        console.log(this.state.items);
        return (

            <div>
                <div style={{ border: '0.35vh groove #00BBFF' }}>
                    {/* <button onClick={this.addBlock(type)}>
                    Click me
                </button> */}

                    <div className='flex-container'>
                        <div style={{ 'flex': '18%', padding: '0.5vh 0.5vw 0.5vh 0.5vw' }}>
                            {choosingColumn}
                        </div>
                        <div style={{ 'flex': '48%', padding: '0.5vh 0.5vw 0.5vh 0.5vw' }} className='code-section'>
                            <div>
                                <Nestable
                                    items={this.state.items}
                                    renderItem={this.renderItem}
                                    onChange={this.onDragEnd}
                                    handler={this.state.isChildDragging ? handlerStub : this.handler}
                                />
                            </div>
                        </div>
                        <div style={{ 'flex': '30%' }} className='vertical-flex-container'>
                            <div style={{ flex: '50%', borderBottom: '1px solid #00BBFF', padding: '0.5vh 0.5vw 0.5vh 0.5vw' }} className="python-code-section vertical-code-container">
                                <div>
                                    {code}
                                </div>
                            </div>
                            <div style={{ flex: '50%', padding: '0.5vh 0.5vw 0.5vh 0.5vw' }}>
                                <ReactTooltip type="info" delayShow={200} className="tooltip-customized" />
                                <div style={{ paddingTop: '5vh', paddingLeft: '5vh' }}>
                                    <img src={Save} width={15} height={15} onClick={(e) => this.onSaveFile(e)} data-tip="Save code as .py file"></img>
                                    <div>
                                        <div style={{ fontSize: '2vh', display: 'inline-block' }}> File name:&nbsp;</div>
                                        <input size="10" style={{ fontFamily: 'Courier New', fontSize: '2vh', display: 'inline-block' }} value={this.state.fileName} onChange={(e) => this.handleFileNameChange(e)}></input>
                                        <div style={{ fontSize: '2vh', display: 'inline-block' }}>.py</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>
        );
    }
}