import React, { Component } from 'react';
import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
const items = [
    { id: 0 },
    {
        id: 1,
        children: [
            { id: 2 }
        ]
    },
    { id: 3 }
];


export default class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: items,
            inputs: {
                0: {
                    type: 0,
                    input1: "x",
                    input2: "1",
                },
                1: {
                    type: 0,
                    input1: "x",
                    input2: "1",
                },
                2: {
                    type: 0,
                    input1: "x",
                    input2: "1",
                },
                3: {
                    type: 0,
                    input1: "x",
                    input2: "1",
                }
            }, // array of tokens
            i: 5
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
        // console.log(`${item} ${path}`);
        console.log(items);
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
            case 0: // +=
                return <div>
                    <input type="text" value={this.state.inputs[id]["input1"]} onChange={(e) => this.handleChange(e, id, "input1")}></input>
                    +=
                    <input type="text" value={this.state.inputs[id]["input2"]} onChange={(e) => this.handleChange(e, id, "input2")}></input>
                </div>
                break;
        }
    }

    handleDelete = (e, item) => {
        const DELETE = "46";
        const BACKSPACE = "8";
        if (e.which == BACKSPACE || e.which == DELETE) { //
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
        return (
            <div>
                <button onClick={this.onClickFunc}>
                    Click me
                </button>
                <Nestable
                    items={this.state.items}
                    renderItem={this.renderItem}
                    onChange={this.onDragEnd}
                />

            </div >
        );
    }
}