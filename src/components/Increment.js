import React, { Component } from 'react';

export default class Increment extends React.Component {
    // variable += int
    constructor(props) {
        super(props);
        this.state = {
            variables: [],
            operations: [],
            num: 0,
            is_block_view: false,
        }
    }

    componentDidMount() {
        const { variables, num, operations, is_block_view } = this.props;
        this.setState(
            {
                variables: variables,
                num: num, // to-do: update num from parent
                operations: operations,
                is_block_view: is_block_view
            },
            () => { }
        );
    }
    render() {

        if (this.state.is_block_view) {
            return (
                <div style={{ display: 'inline', border: '3px solid white' }}>
                    <select style={{ appearance: 'none', paddingLeft: '5px', paddingRight: '5px', textAlignLast: 'left', fontFamily: 'Courier New' }}>
                        {this.props.variables.map((variable, index) => (
                            <option value={variable} style={{ fontFamily: 'Courier New' }}>{variable}</option>
                        ))}
                    </select>
                    <select style={{ appearance: 'none', paddingLeft: '5px', paddingRight: '5px', textAlignLast: 'left', width: '30px', fontFamily: 'Courier New' }}>
                        {this.props.operations.map((operation, index) => (
                            <option value={operation}>{operation}</option>
                        ))}
                    </select>

                    <input type="text" maxLength="1" size="1" width="1" value={this.props.num} style={{ width: '8px', height: '11px', fontFamily: 'Courier New' }} />

                </div>
            );
        } else {
            return (
                <div style={{ display: 'inline', border: '3px solid white' }}>
                    <select style={{ appearance: 'none', paddingLeft: '5px', paddingRight: '5px', textAlignLast: 'left', border: 'hidden', outline: 'hidden', fontFamily: 'Courier New' }}>
                        {this.props.variables.map((variable, index) => (
                            <option value={variable} style={{ fontFamily: 'Courier New' }}>{variable}</option>
                        ))}
                    </select>
                    <select style={{ appearance: 'none', paddingLeft: '5px', paddingRight: '5px', textAlignLast: 'left', border: 'hidden', outline: 'hidden', width: '30px', fontFamily: 'Courier New' }}>
                        {this.props.operations.map((operation, index) => (
                            <option value={operation}>{operation}</option>
                        ))}
                    </select>

                    <input style={{ border: 'none' }} type="text" maxLength="1" size="1" width="1" value={this.props.num} style={{ width: '8px', height: '11px', fontFamily: 'Courier New' }} />

                </div >
            );
        }
    }
}
