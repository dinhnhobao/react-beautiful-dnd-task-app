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

const handleClick = (e, item) => {
    // e.stopPropagation(); // this may be needed if you dont use drag handler
    console.log("direct click!", item);
};

const handleDelete = (e, item) => {
    const DELETE = "46";
    const BACKSPACE = "8";
    if (e.which == BACKSPACE || e.which == DELETE) { //
        console.log("Delete button pressed");
    }
};




const renderItem = ({ item, handler }) =>
    <div>
        {handler}
        {/* <div onClick={e => handleClick(e, item)}>
            1
        </div> */}
        <div tabindex="0" onKeyDown={(e) => handleDelete(e, item)}> {/* listen for keyboard events */}
            1
        </div>
        {item.text}
    </div >;
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

    onDragEnd = (items) => {
        console.log(items);
        const newItems = JSON.parse(JSON.stringify(items));
        this.setState(newItems);
        console.log(newItems);
    }

    onTrash = () => {
        console.log("Trash hovered");
    }
    render() {
        return (
            <div>
                <button onClick={this.onClickFunc}>
                    Click me
                </button>
                <Nestable
                    items={this.state.items}
                    renderItem={renderItem}
                    onChange={this.onDragEnd}
                />

                <Nestable
                    items={[{ id: 1, text: 'Trash' }]}
                    renderItem={renderItem}
                />
            </div >
        );
    }
}