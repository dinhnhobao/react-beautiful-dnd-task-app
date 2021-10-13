import React, { Component } from 'react';

export default class FunctionDeclaraton extends React.Component {
    // variable += int
    constructor(props) {
        super(props);
        this.state = {
            function_name: '',
            inputs: '', // string separated by 
        }
    }

    componentDidMount() {
        const { function_name, inputs } = this.props;
        this.setState(
            {
                function_name: function_name,
                inputs: inputs, // to-do: update num from parent
            },
            () => { }
        );
    }
    render() {
        console.log(this.props.function_name.length);
        return (
            <div style={{ display: 'inline' }}>
                def&nbsp;<input style={{ border: 'none' }} type="text" maxLength="20" value={this.props.function_name} style={{ width: '80px', height: '11px', fontFamily: 'Courier New' }} />(
                <input value={this.props.inputs} style={{ width: '40px', height: '11px', fontFamily: 'Courier New' }} />
                ):
            </div>
        );
    }
}
