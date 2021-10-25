import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import Increment from './components/Increment';
import FunctionDeclaration from './components/FunctionDeclaration';
import Test from './test';
const Container = styled.div`
  display: flex;
  font: Consolas;
`;

class App extends React.Component {
  render() {
    return (
      <div style={{ fontFamily: 'Courier New', input: 'Courier New' }}>
        <div>
          <Test></Test>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
