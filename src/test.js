import React, { Component } from 'react';
import Nestable from 'react-nestable';
import 'react-nestable/dist/styles/index.css';

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

const renderItem = ({ item }) => item.text;


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
    render() {
        return (
            <div>
                <button onClick={this.onClickFunc}>
                    Click me
                </button>
                <Nestable
                    items={this.state.items}
                    renderItem={renderItem}
                />
            </div>
        );
    }
}