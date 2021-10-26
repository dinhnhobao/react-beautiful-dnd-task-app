import React, { Component } from 'react';
import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import './app.css';
import Drag from './images/drag-flick.png';
import Drop from './images/drop-here.png';
import Add from './images/add.svg';

const { MODEL_BLOCKS, TREE } = require('./constants');
const { parseBlock, parseTree } = require('./parser');

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
            items: TREE.items,
            inputs: TREE.inputs,
            i: 10000,
            droppableData: '',
            isChildDragging: false
        };
    }

    handleInputChange(event, id, input) {
        const newInputs = JSON.parse(JSON.stringify(this.state.inputs));
        newInputs[id][input] = event.target.value;
        this.setState({ inputs: newInputs });
    }

    addBlock = (e, index) => { // index in model blocks
        const newItems = [...this.state.items];
        const newInputs = JSON.parse(JSON.stringify(this.state.inputs));
        newItems.push({ id: this.state.i });
        newInputs[this.state.i] = MODEL_BLOCKS[index];

        this.setState({ items: newItems, i: this.state.i + 1, inputs: newInputs }, () => {
            if (index == 7) { // if -> also push elif and else
                this.addBlock(e, 8);
            } else if (index == 8) {
                this.addBlock(e, 9);
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

        const input1_div = (
            <input value={this.state.inputs[id]["input1"]}
                onChange={(e) => this.handleInputChange(e, id, "input1")} style={{ width: '40px', height: '11px', fontFamily: 'Courier New', fontSize: '2.5vh' }} />
        )

        const input2_div = (
            <input value={this.state.inputs[id]["input2"]}
                onChange={(e) => this.handleInputChange(e, id, "input2")} style={{ width: '40px', height: '11px', fontFamily: 'Courier New', fontSize: '2.5vh' }} />
        )

        switch (fields["type"]) {
            case 0: case 1:
                var OPERATORS;
                if (fields["type"] === 0) {
                    OPERATORS = ['+=', '-=', '*=', '/='];
                } else if (fields["type"] === 1) {
                    OPERATORS = ['<', '<=', '==', '>=', '>', '!='];
                }
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
            case 5: // or
                var OPERATORS = ['and', 'or'];
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

    onDrop = (e, id) => {
        let expression = e.dataTransfer.getData("condition");

        const newInputs = JSON.parse(JSON.stringify(this.state.inputs));
        newInputs[id]["input1"] = expression;
        this.setState({
            inputs: newInputs
        }, () => {
            this.setState({ isChildDragging: false });
        });
    }

    onDragStart = (e, id) => {
        console.log("Drag started");
        e.dataTransfer.setData("condition", parseBlock(this.state.inputs[id])); // DataTransfer object is used to hold the data that is being dragged during a drag and drop operation.
    }

    onDrag = (e) => {
        this.setState({ isChildDragging: false });
    }

    onDragExpressionEnd = (e) => {
        this.setState({ isChildDragging: false });
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
                    <pre style={{ fontFamily: 'Courier New', fontSize: '2.5vh' }}>
                        {String.fromCharCode(160).repeat(row.indent) + row.command}
                    </pre>
                </div>
            ))}
        </div>

        return (


            <div>
                {/* <button onClick={this.addBlock(type)}>
                    Click me
                </button> */}

                <div className='flex-container'>
                    <div style={{ 'flex': '20%' }}>
                        {choosingColumn}
                    </div>
                    <div style={{ 'flex': '50%' }} className='code-section'>
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
                        <div style={{ flex: '50%' }} className="python-code-section vertical-code-container">
                            {code}
                        </div>
                        <div style={{ flex: '50%' }}>
                            1111
                        </div>
                    </div>
                </div>

                {/* <div draggable onDragStart={(e) => this.onDragStart(e, 1)} onDragEnd={(e) => this.onDragExpressionEnd(e)}>Drag</div>
                <div onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => this.onDrop(e, "complete")}
                > */}
                {/* Droppable data = {this.state.droppableData} */}
            </div>
        );
    }
}