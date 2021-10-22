import React, { Component } from 'react';
import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
const items = [
    { id: 0, text: 'Andy' },
    {
        id: 1, text: 'Harry',
        children: [
            { id: 2, text: 'David' }
        ]
    },
    { id: 3, text: 'Lisa' }
];


export default class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            items: items,
            i: 5
        };
    }

    onClickFunc = () => {
        const newItems = [...this.state.items];
        newItems.push({ id: this.state.i, text: `index ${this.state.i}` });
        console.log(this.state.i);

        this.setState({ items: newItems, i: this.state.i + 1 });
        console.log(this.state);
    }

    onDragEnd = (items, item, path) => {
        console.log(`${item} ${path}`);
        console.log(items);
        const newItems = JSON.parse(JSON.stringify(items));
        this.setState(newItems);
        console.log(newItems);
    }

    renderItem = ({ item, handler }) =>
        <div>
            {handler}
            {/* <div onClick={e => handleClick(e, item)}>
            1
        </div> */}
            <div tabIndex="0" onKeyDown={(e) => this.handleDelete(e, item)}> {/* listen for keyboard events */}
                1
            </div>
            {item.text}
        </div >;

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